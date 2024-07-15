/**
 * @file Rotas de Tenants
 * @version 1.0.0
 * @since 1.0.0
 * @created 2024-06-16 03:33:38
 * @updated 
 * @autor Rafael Freitas
 */

import express from 'express';
import authorizer from './middlewares/authorizer.js';
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'

const router = express.Router();

/**
 * Retorna o .env do gateway
 * @function
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 * @param {Function} next - Próxima função middleware.
 */
router.get('/env', authorizer, async (req, res, next) => {
  try {
    const envFilePath = path.join(process.cwd(), `.env.${process.env.NODE_ENV || 'development'}`);
    const envConfig = dotenv.parse(fs.readFileSync(envFilePath));
    res.json(envConfig);
  } catch (err) {
    next(err);
  }
});

const route = express.Router();
route.use('/gateway', router)

export default route;
