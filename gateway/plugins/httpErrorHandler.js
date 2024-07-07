/**
 * @file Configurar o tratamento de erros do servidor http na aplicaçao
 * @version 1.0.0
 * @since 1.0.0
 * @namespace plugins
 * @author Rafael Freitas
 * @created 2024-06-12
 * @updated -
 */

import errorHandler from '../http/middlewares/errorHandler.js';
import { app } from './httpserver.js';
import { ApplicationLogger } from 'wampark'
// import logger from '../lib/logger.js';
// const log = logger.create('httpErrorHandler')
const log = new ApplicationLogger('Plugin', 'httpErrorHandler')

export default {
  install () {},
  start () {
    log.info(`HTTP error handler middleware installed`)
    app.use(errorHandler)
  },
};