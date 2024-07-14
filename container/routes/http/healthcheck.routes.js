/**
 * @file Healthcheck http route
 * @version 0.0.1
 * @since 0.0.0
 * @namespace routes.public
 * @created 
 * @updated 
 * @autor 
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

export default router;