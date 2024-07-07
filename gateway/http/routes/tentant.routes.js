/**
 * @file Rotas de Tenants
 * @version 1.0.0
 * @since 1.0.0
 * @created 2024-06-16 03:33:38
 * @updated 
 * @autor Rafael Freitas
 */

import express from 'express';
import authorizer from '../middlewares/authorizer.js';
import TenantsModel from '../../db/tenants/TenantsModel.js';
import { ApplicationError } from 'wampark';

const router = express.Router();

/**
 * Lista de tenants
 * @function
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 * @param {Function} next - Próxima função middleware.
 */
router.get('/', authorizer, async (req, res, next) => {
  try {
    let tenants = await TenantsModel.find().lean();
    res.json({ dataset: tenants });
  } catch (err) {
    next(err);
  }
});

router.post('/', authorizer, async (req, res, next) => {
  try {
    let record = new TenantsModel(req.body);
    await record.save();
    res.json(record);
  } catch (err) {
    // throw err
    next(err);
  }
});

router.get('/domain/:domain', authorizer, async (req, res, next) => {
  try {
    let record = await TenantsModel.findOne({ domain: req.params.domain });
    if (!record) {
      throw new ApplicationError({
        status: 404,
        code: 'A001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authorizer, async (req, res, next) => {
  try {
    let record = await TenantsModel.findOne({ _id: req.params.id });
    if (!record) {
      throw new ApplicationError({
        status: 404,
        code: 'B001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
});



router.put('/:id', authorizer, async (req, res, next) => {
  try {
    const updatedResult = await TenantsModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedResult) {
      throw new ApplicationError({
        status: 404,
        code: 'C001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }

    res.json(updatedResult);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authorizer, async (req, res, next) => {
  try {
    const deleteResult = await TenantsModel.findByIdAndDelete(req.params.id);
    if (!deleteResult) {
      throw new ApplicationError({
        status: 404,
        code: 'D001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }
    // no content to send
    res.status(204);
  } catch (err) {
    next(err);
  }
});

export default router;
