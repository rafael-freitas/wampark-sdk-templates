/**
 * @file Plugin para proxy de WS
 * @version 0.0.1
 * @since 0.0.0
 * @namespace plugins
 * @author Rafael Freitas
 * @created 2024-06-12
 * @updated -
 */

import { createProxyMiddleware } from 'http-proxy-middleware';
import application, { ApplicationLogger } from 'wampark'
import {app} from './httpserver.js';

const log = new ApplicationLogger('Plugin', 'proxyws')

export default {
  install () {

    const WS_PROXY_TARGET = process.env.WS_PROXY_TARGET
    const HTTP_PORT = process.env.HTTP_PORT || 3000;
    const HTTP_HOST = process.env.HTTP_HOST || 'localhost'

    application.settings.ws = `ws://${HTTP_HOST}:${HTTP_PORT}/ws`
    const {ws} = application.settings
    log.block('Proxy', ws).block('Target', WS_PROXY_TARGET, 'blue').info('Forwarding')

    app.use('/ws', createProxyMiddleware({
      target: WS_PROXY_TARGET,
      changeOrigin: true,
      ws: true,
      secure: true,
      logLevel: 'debug'
    }))
  },
  start () {

  }
};