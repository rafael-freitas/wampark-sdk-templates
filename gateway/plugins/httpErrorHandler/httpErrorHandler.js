/**
 * @file Configurar o tratamento de erros do servidor http na aplicaçao
 * @version 1.0.0
 * @since 1.0.0
 * @namespace plugins
 * @author Rafael Freitas
 * @created 2024-07-13 20:40:48
 * @updated -
 */

import errorHandler from './errorHandler.middlewere.js';
import { app } from '../httpserver.js';
import { ApplicationLogger } from 'wampark'

const log = new ApplicationLogger('Plugin', 'httpErrorHandler')

export default {
  install () {},
  start () {
    log.info(`Middleware installed`)
    app.use(errorHandler)
  },
};