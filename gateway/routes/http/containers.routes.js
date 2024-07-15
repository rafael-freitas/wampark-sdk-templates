/**
 * @file Rotas de containers
 * @version 1.0.0
 * @since 1.0.0
 * @created 2024-06-16 03:33:38
 * @updated 
 * @autor Rafael Freitas
 */

import { ApplicationError } from 'wampark';
import { v4 as _uuid } from 'uuid'
import express from 'express';
import authorizer from './middlewares/authorizer.js';
// import ContainersModel from '../../db/containers/ContainersModel.js';
import store from '../../lib/MemoryStore.js'

const router = express.Router();

/**
 * Lista de containers
 * @function
 * @param {Object} req - Objeto de requisição.
 * @param {Object} res - Objeto de resposta.
 * @param {Function} next - Próxima função middleware.
 */
router.get('/', authorizer, async (req, res, next) => {
  try {
    let containers = await store.containers.find()
    res.json({ dataset: containers });
  } catch (err) {
    next(err);
  }
});

router.post('/', authorizer, async (req, res, next) => {
  try {
    let record = await store.containers.create(req.body)
    // let record = new ContainersModel(req.body);
    // await record.save();
    res.json(record);
  } catch (err) {
    // throw err
    next(err);
  }
});

router.get('/:id', authorizer, async (req, res, next) => {
  try {
    // let record = await ContainersModel.findOne({ _id: req.params.id });
    let record = await store.containers.get(req.params.id)
    if (!record) {
      throw new ApplicationError({
        status: 404,
        code: 'A001',
        family: 'containers',
        message: `Container not found`
      });
    }
    res.json(record);
  } catch (err) {
    next(err);
  }
});

router.put('/:id', authorizer, async (req, res, next) => {
  try {

    const updatedResult = await store.containers.update(req.params.id, req.body);

    // const updatedResult = await ContainersModel.findOneAndUpdate(
    //   { _id: req.params.id },
    //   req.body,
    //   { new: true, runValidators: true }
    // );

    if (!updatedResult) {
      throw new ApplicationError({
        status: 404,
        code: 'B001',
        family: 'containers',
        message: `Container not found`
      });
    }

    res.json(updatedResult);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', authorizer, async (req, res, next) => {
  try {
    const deleteResult = await store.containers.delete(req.params.id);
    // const deleteResult = await ContainersModel.findByIdAndDelete(req.params.id);
    if (!deleteResult) {
      throw new ApplicationError({
        status: 404,
        code: 'C001',
        family: 'containers',
        message: `Container not found`
      });
    }
    // no content to send
    res.status(204).json({});
  } catch (err) {
    next(err);
  }
});

const route = express.Router();
route.use('/containers', router)

export default route;
