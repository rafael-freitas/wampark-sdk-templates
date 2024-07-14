/**
 * @file Container index routes
 * @version 0.0.1
 * @since 0.0.0
 * @created 2024-07-08 23:18:52
 * @updated -
 * @autor Rafael Freitas
 */

import express from 'express'
import application, {ApplicationLogger} from 'wampark'

// Log APP HTTP
const log = new ApplicationLogger('HTTP', 'Routes')

const router = express.Router();


const logBlock_index = log.block('REST', '/index')
logBlock_index.block('Route', '/index').info('GET')

router.get('/index', (req, res, next) => {
  const requestId = req.headers.get('x-request-id')
  logBlock_index.block('RequestId', requestId).info('Received')
  res.json({
    message: 'Your container is already'
  })
});

export default router;
