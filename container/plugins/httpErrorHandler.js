/**
 * @file Configurar o tratamento de erros do servidor http na aplicaçao
 * @version 1.0.0
 * @since 1.0.0
 * @author Rafael Freitas
 * @created 2024-06-12
 * @updated -
 */

import { ApplicationLogger, ApplicationError } from 'wampark';
import { app } from './httpserver.js';

const log = new ApplicationLogger('Plugin', 'httpErrorHandler')

function errorHandler (err, req, res, next) {
  const error = ApplicationError.parse(err);
  res.status(error.status || 500);
  res.json({
    error: error.toObject(),
  });
};


export default {
  install () {},
  start () {
    log.info(`HTTP error handler middleware installed`)
    app.use(errorHandler)
  },
};