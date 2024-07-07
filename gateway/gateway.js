/**
 * @file Gateway Tenancy Service
 * @version 1.0.0
 * @since 1.0.0
 * @author Rafael Freitas
 * @created 2024-06-16 02:09:35
 * @updated 2024-07-07 09:08:31
 */

import { fileURLToPath } from 'url'
import gateway, {application} from './lib/Gateway.js'
// Path do arquivo principal da aplicação
const __filename = fileURLToPath(import.meta.url)

// Configurar aplicacao
application.setup({
  // usar multi threads
  use_worker_threads: process.env.USE_WORKER_THREADS === 'true',
  worker_filepath: __filename,

})

application.start()