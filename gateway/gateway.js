/**
 * @file Gateway Service
 * @version 1.0.0
 * @since 1.0.0
 * @author Rafael Freitas
 * @created 2024-07-13 20:31:39
 */

import { fileURLToPath } from 'url'
import gateway, {application} from './lib/Gateway.js'

import AppSessionSetRoute from './routes/ws/app.session.set.js'
import AppSessionGetRoute from './routes/ws/app.session.get.js'
import WampSessionOnLeave from './routes/ws/wamp.session.on_leave.js'

// Path do arquivo principal da aplicação
const __filename = fileURLToPath(import.meta.url)

// Configurar aplicacao
application.setup({
  // usar multi threads
  use_worker_threads: process.env.USE_WORKER_THREADS === 'true',
  worker_filepath: __filename,

  // Crossbar.io
  wamp: {
    url: process.env.WAMP_URL,
    realm: process.env.WAMP_REALM,
    authid: process.env.WAMP_AUTHID,
    authpass: process.env.WAMP_AUTHPASS,
  }
})

application.attachRoute(AppSessionSetRoute)
application.attachRoute(AppSessionGetRoute)
application.attachRoute(WampSessionOnLeave)

application.start()