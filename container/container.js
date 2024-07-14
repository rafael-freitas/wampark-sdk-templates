/**
 * @file Container Boilerplate
 * @version 1.0.0
 * @since 1.0.0
 * @author Rafael Freitas
 * @created 2024-06-17 22:59:31
 * @updated 
 */
import application from 'wampark';
import { fileURLToPath } from 'url'
import Container from './lib/Container.js'

// #plugins - Plugins
import { app } from './plugins/httpserver.js'

// #http_middlewares - Middlewares HTTP

// #http_routes - Rotas HTTP
import indexRoutes from './routes/http/index.routes.js'

// #routes - Rotas RPC/PUBSUB

// Path do arquivo principal da aplicação
const __filename = fileURLToPath(import.meta.url)


// Setup application
application.setup({
  // nao usar multi threads
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

// #plugins_install - Instalar Plugins

// #http_routes_install - HTTP Routes
app.use(indexRoutes);

// #routes_attach - Rotas RPC/PUBSUB

application.start()
