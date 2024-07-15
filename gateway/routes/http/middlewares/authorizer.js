/**
 * @file Middleware de acesso do gateway via x-secret-key
 * @version 1.0.0
 * @since 1.0.0
 * @autor Rafael Freitas
 * @created 2024-06-17 06:16:26
 * @updated -
 */

import { ApplicationError } from 'wampark'; // Ajuste o caminho conforme necessário

function getSecretKey() {
  return process.env.SECRET_KEY;
}

const authorizer = (req, res, next) => {
  const secretKey = req.headers['x-secret-key'];

  if (!secretKey) {
    res.status(401).json({ error: 'Secret key not provided' });
    return;
  }

  if (secretKey !== getSecretKey()) {
    res.status(401).json({ error: 'Invalid secret key' });
    return;
  }

  next();
};

export default authorizer;
