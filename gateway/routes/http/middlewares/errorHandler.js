/**
 * @file Middleware de tratamento de erros
 * @version 1.0.0
 * @since 1.0.0
 * @autor Rafael Freitas
 * @created 2024-06-17 06:16:26
 * @updated -
 */

import { ApplicationError } from 'wampark';

export default function errorHandler (err, req, res, next) {
  const error = ApplicationError.parse(err);
  res.status(error.status || 500);
  res.json({
    error: error.toObject(),
  });
  // Application.emit('http.error', error);
};
