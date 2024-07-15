/**
 * @file Rotas públicas da aplicação
 * @version 0.0.1
 * @since 0.0.0
 * @namespace routes.public
 * @created 2024-06-12
 * @updated -
 * @autor Rafael Freitas
 */

import express from 'express';
import application from 'wampark';

const router = express.Router();

/**
 * Rota que indica ao POD do kubernetes que o container está rodando
 * @function
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 */
router.get('/', (req, res) => {
  res.json({
    status: application.status || 'ready',
  });
});

const route = express.Router();
route.use('/healthcheck', router)

export default route;
