/**
 * @file Containers handler
 * @version 1.0.0
 * @since 1.0.0
 * @namespace plugins
 * @autor Rafael Freitas
 * @created 2024-06-17 16:50:56
 * @updated -
 */

import { v4 as uuid } from 'uuid';
import { createProxyMiddleware } from 'http-proxy-middleware';
import Application, { ApplicationError, ApplicationLogger } from 'wampark';
import { app } from './httpserver.js';
// import ContainersModel from '../db/containers/ContainersModel.js';
// import TenantsModel from '../db/tenants/TenantsModel.js';
import errorHandler from '../http/middlewares/errorHandler.js';
import store from '../lib/MemoryStore.js';

const log = new ApplicationLogger('Plugin', 'ContainersManager')

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTP_HOST = process.env.HTTP_HOST || 'localhost';
const LOG_REQUEST_STATIC = process.env.LOG_REQUEST_STATIC === 'true'

let installed = false;

export default {

  getContainerTargetUrl(container) {
    const containerUrl = `http://${container.host}:${container.port}`;
    return containerUrl;
  },

  getContainerStaticTargetUrl(container) {
    const staticUrl = `http://${container.host}:${container.port}/static/`;
    return staticUrl;
  },


  getContainerProxyHeaders(container, tenant, requestId) {
    const headers = {
      'x-container-id': container._id,
      'x-request-id': requestId,
    };

    if (tenant) {
      Object.assign(headers, {
        'x-tenant-id': tenant._id,
        'x-tenant-domain': tenant.domain,
        'x-tenant-database': tenant.databaseName,
      })
    }
    return headers;
  },

  getContainerMiddleware(container, staticRequest = false) {
    let targetUrl

    if (staticRequest) {
      targetUrl = this.getContainerStaticTargetUrl(container);
    }
    else {
      targetUrl = this.getContainerTargetUrl(container)
    }

    let middleware

    return function (options) {
      const middlewareOptions = {
        getHeaders: (proxyReq, req, res) => { return {}},
        onRequest: (proxyReq, req, res) => {},
        onResponse: (proxyRes, req, res) => {},
        onError: (err, req, res) => {},
        ...options
      }
      if (middleware) {
        return middleware
      }
      // let pathRewriteKey = `^${container.path}`
      middleware = createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        selfHandleResponse: !staticRequest,
        // pathRewrite: {
        //   [pathRewriteKey]: '/container'
        // },
        on: {
          proxyReq: (proxyReq, req, res) => {
            
            let containerHeaders = middlewareOptions.getHeaders(proxyReq, req, res)
  
            // Mesclar headers da requisição com headers do container
            let headers = {
              ...req.headers,
              ...containerHeaders
            }
            // Adicionar headers da requisição
            for (const header of Object.keys(headers)) {
              proxyReq.setHeader(header, headers[header]);
            }
  
            middlewareOptions.onRequest(proxyReq, req, res)

            if (staticRequest) {
              proxyReq.path = req.originalUrl.replace(container.staticPath, '/static');
              return proxyReq.end()
            }

            // Replica o url original do request para o container
            proxyReq.path = req.originalUrl

            // parse content para JSON string
            const bodyData = JSON.stringify(req.body);

            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
            proxyReq.write(bodyData);
            proxyReq.end()
            
          },
          proxyRes: (proxyRes, req, res) => {

            if (staticRequest) {
              return middlewareOptions.onResponse(proxyRes, req, res, res.body)
            }
  
            // Copia os cabeçalhos da resposta do proxy para a resposta original
            if (!res.headersSent) {
              Object.keys(proxyRes.headers).forEach(header => {
                res.setHeader(header, proxyRes.headers[header]);
              });
            }

            // return res.status(proxyRes.statusCode).write(proxyRes.body).end();
  
            let body = [];
            proxyRes.on('data', chunk => {
              body.push(chunk);
            });
            proxyRes.on('end', () => {
              body = Buffer.concat(body).toString();

              middlewareOptions.onResponse(proxyRes, req, res, body)

              res.status(proxyRes.statusCode).send(body);
            });
          },
          error: (err, req, res) => {
            middlewareOptions.onError(err, req, res)
            return res.send(err.message)
          }
        },
      })
      return middleware
    }
  },

  createContainersProxyHandler () {
    
    const logBlocks = log.block('HTTP')

    // Dynamic proxy for app with domain parameter
    const containerEndpoint = async (req, res, next) => {
      const requestId = uuid();

      let logBlockRequest = logBlocks.block('RequestId', requestId)

      const method = req.method;
      const path = req.path;
      // const params = req.params;
      const query = req.query;
      const body = req.body;

      // Extração de parâmetros da URL
      const pathParts = req.params[0].split('/').filter(part => part !== '');
      const params = {
        containerPath: '/' + (pathParts[0] || ''),
        domain: pathParts[1],
      }

      let container = await store.containers.getByPath(params.containerPath)
      let staticContainer = false

      if (!container) {
        container = await store.containers.getByStaticPath(params.containerPath)
        if (container) {
          staticContainer = true
        }
      }

      if (!container && !staticContainer) {
        logBlockRequest.warn(`No such container for ${params.containerPath}`)
        return res.status(404).json({
          error: {
            message: 'Container not found'
          }
        })
      }
      logBlockRequest = logBlockRequest.block('Container', container.name)

      if (container.active === false) {
        logBlockRequest.block('Active', 'false', 'red').warn('Container disabled')

        return res.status(400).json({
          error: {
            message: `Container ${container._id} disabled`
          }
        })
      }

      if (staticContainer) {
        // logBlockRequest = logBlockRequest.block('Tenant', tenant.name)
        logBlockRequest = logBlockRequest.block('Static')

          let middlewareFunction = store.containers.getValue(container._id, 'middlewareStatic')
          if (!middlewareFunction) {
            middlewareFunction = this.getContainerMiddleware(container, true);
            store.containers.setValue(container._id, 'middlewareStatic', middlewareFunction)
          }
          const middleware = middlewareFunction({
            getHeaders: (proxyReq, req, res) => {
              return this.getContainerProxyHeaders(container, false, requestId);
            },
            onRequest: (proxyReq, req, res) => {
              if (!LOG_REQUEST_STATIC) {
                return
              }
              logBlockRequest.block('Send').info(req.originalUrl);
            },
            onResponse: (proxyRes, req, res, body) => {
              if (proxyRes.statusCode >= 400) {
                let message = proxyRes.statusMessage
                logBlockRequest.block('Response', proxyRes.statusCode).warn(message)
              }
              else {
                if (!LOG_REQUEST_STATIC) {
                  return
                }
                logBlockRequest.block('Response', proxyRes.statusCode).info('OK');
              }
            },
            onError: (err, req, res) => {
              const { code, message } = err;
              logBlockRequest.block('Response', code).error(message);
            },
          })
          return middleware(req, res, next);
      }
      else {
        if (container.tenancy) {
          const domain = params.domain
          // obter o tenant por dominio
          let tenant = await store.tenants.getByDomain(domain)
  
          if (!tenant) {
            const error = new ApplicationError({
              status: 404,
              code: 'A001',
              family: 'ContainersManager',
              message: `Tenant for domain ${domain} does not exist`
            });
  
            logBlockRequest.error(error.message)
            
            // log.error(`[HTTP][Container=${log.colors.green(containerObj.name)}][Tenant=${log.colors.red(domain)}][RequestId=${log.colors.green(requestId)}] ${error.message} ${log.fail}`);
            return next(error);
          }
          logBlockRequest = logBlockRequest.block('Tenant', tenant.name)
          logBlockRequest = logBlockRequest.block(req.method)

          let middlewareFunction = store.containers.getValue(container._id, 'middleware')
          if (!middlewareFunction) {
            middlewareFunction = this.getContainerMiddleware(container, false);
            store.containers.setValue(container._id, 'middleware', middlewareFunction)
          }
          const middleware = middlewareFunction({
            getHeaders: (proxyReq, req, res) => {
              return this.getContainerProxyHeaders(container, tenant || {}, requestId);
            },
            onRequest: (proxyReq, req, res) => {
              logBlockRequest.block('Send').info(req.originalUrl);
            },
            onResponse: (proxyRes, req, res, body) => {
              if (proxyRes.statusCode >= 400) {
                let message = proxyRes.statusMessage
                // verificar se o retorno é um error de ApplicationError
                try {
                  let json = JSON.parse(body)
                  if (json.error) {
                    let error = ApplicationError.parse(json.error)
                    message = error.message
                  }
                } catch (err) {}
                logBlockRequest.block('Response', proxyRes.statusCode).warn(message)
              }
              else {
                logBlockRequest.block('Response', proxyRes.statusCode).info('OK');
              }
            },
            onError: (err, req, res) => {
              const { code, message } = err;
              logBlockRequest.block('Response', code).error(message);
            },
          })
          return middleware(req, res, next);
        }
      }
    }

    app.use('*', containerEndpoint)
  },

  async initializeContainers() {

    this.createContainersProxyHandler()

    // remover middlewares da memoria
    store.containers.afterUpdate = (id, data) => {
      store.containers.deleteValue(id, 'middlware')
      store.containers.deleteValue(id, 'middlewareStatic')
    }

    // remover middlewares da memoria
    store.containers.afterDelete = (id) => {
      store.containers.deleteValue(id, 'middlware')
      store.containers.deleteValue(id, 'middlewareStatic')
    }

    // adicionar o errorHandler depois de criar todas as rotas dos containers
    app.use(errorHandler);
  },

  install() {
    Application.on('db.mongoose.connected', () => {
      if (installed) {
        return;
      }
      installed = true;
      this.initializeContainers();
    });
  },

  start() {}
};
