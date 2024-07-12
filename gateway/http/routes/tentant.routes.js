// tenant.routes.js

import express from 'express';
import authorizer from '../middlewares/authorizer.js';
import TenantsModel from '../../db/tenants/TenantsModel.js';
import { ApplicationError } from 'wampark';

const router = express.Router();

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
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// Add a container to the tenant
router.get('/:id/containers', authorizer, async (req, res, next) => {
  try {
    const tenant = await TenantsModel.findById(req.params.id);
    if (!tenant) {
      throw new ApplicationError({
        status: 404,
        code: 'E001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }
    res.json({
      dataset: tenant.containers || []
    });
  } catch (err) {
    next(err);
  }
});

// Add a container to the tenant
router.put('/:id/containers', authorizer, async (req, res, next) => {
  try {
    const tenant = await TenantsModel.findById(req.params.id);
    if (!tenant) {
      throw new ApplicationError({
        status: 404,
        code: 'E001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }
    tenant.containers.push(req.body);
    await tenant.save();
    res.json(tenant);
  } catch (err) {
    next(err);
  }
});

// Remove a container from the tenant
router.delete('/:id/containers/:containerId', authorizer, async (req, res, next) => {
  try {
    const tenant = await TenantsModel.findById(req.params.id);
    if (!tenant) {
      throw new ApplicationError({
        status: 404,
        code: 'F001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }
    tenant.containers.id(req.params.containerId).remove();
    await tenant.save();
    res.json(tenant);
  } catch (err) {
    next(err);
  }
});

// Update a container in the tenant
router.put('/:id/containers/:containerId', authorizer, async (req, res, next) => {
  try {
    const tenant = await TenantsModel.findById(req.params.id);
    if (!tenant) {
      throw new ApplicationError({
        status: 404,
        code: 'G001',
        family: 'Tenants',
        message: `Tenant not found`
      });
    }
    const container = tenant.containers.id(req.params.containerId);
    if (!container) {
      throw new ApplicationError({
        status: 404,
        code: 'H001',
        family: 'Containers',
        message: `Container not found`
      });
    }
    container.set(req.body);
    await tenant.save();
    res.json(tenant);
  } catch (err) {
    next(err);
  }
});

export default router;
