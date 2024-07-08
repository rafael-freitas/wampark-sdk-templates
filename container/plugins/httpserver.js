/**
 * @file Configuração do servidor web com express
 * @version 1.0.0
 * @since 1.0.0
 * @created 2024-06-12
 * @updated -
 * @author Rafael Freitas
 */

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import https from 'https';
import Application, { ApplicationError, ApplicationLogger } from 'wampark';

const log = new ApplicationLogger('Plugin', 'httpserver')

const SSL_ON = process.env.SSL_ON === 'true'
const SSL_PRIVATE_KEY = process.env.SSL_PRIVATE_KEY
const SSL_CERT = process.env.SSL_CERT

const HTTPS_PORT = process.env.HTTPS_PORT || 3000;
const HTTPS_HOST = process.env.HTTPS_HOST || 'localhost'

const HTTP_PORT = process.env.HTTP_PORT || 3000;
const HTTP_HOST = process.env.HTTP_HOST || 'localhost'

// const HTTP_PROTOCOL = process.env.HTTP_PROTOCOL || 'http'

// Cria a aplicação Express
const app = express();

// Configura o CORS para aceitar qualquer requisição
app.use(cors());

// Middleware para parsear o corpo das requisições
app.use(express.json()); // Substitui bodyParser.json()
app.use(express.urlencoded({ extended: true })); // Substitui bodyParser.urlencoded()

export {
  app
}

export default {
  install () {
    if (SSL_ON) {
      if (!SSL_PRIVATE_KEY || !fs.existsSync(SSL_PRIVATE_KEY)) {
        throw new ApplicationError({
          code: 'A001',
          message: 'SSL private key not found',
          family: 'httpserver',
        })
      }
      if (!SSL_CERT || !fs.existsSync(SSL_CERT)) {
        throw new ApplicationError({
          code: 'A002',
          message: 'SSL certificate not found',
          family: 'httpserver',
        })
      }
      // Carregar certificados SSL
      this.options = {
        key: fs.readFileSync(SSL_PRIVATE_KEY),
        cert: fs.readFileSync(SSL_CERT)
      };
    }

  },
  start () {

    if (SSL_ON) {
      // log.add('HTTPS')
      // Criar o servidor HTTPS
      const server = https.createServer(this.options, app.callback());

      // Inicia o servidor Web
      server.listen(HTTPS_PORT, () => {
        let uri = `https://${HTTPS_HOST}:${HTTPS_PORT}`
        log.block('HTTPS', uri).info(`Listening`)
        Application.emit('httpserver.running', server)
      })
    }
    else {
      // log.add('HTTP')
      // Inicia o servidor Web
      app.listen(HTTP_PORT, () => {
        let uri = `http://${HTTP_HOST}:${HTTP_PORT}`
        // log.info(`Server running on ${log.yellow(uri)}`)
        log.block('HTTP', uri).info(`Listening`)
        Application.emit('httpserver.running', app)
      })
    }
  }
};
