/**
 * @file Gateway Tenancy Service
 * @version 1.0.0
 * @since 1.0.0
 * @author Rafael Freitas
 * @created 2024-06-16 02:09:35
 * @updated 
 */
import { fileURLToPath } from 'url'
import application, {ApplicationLogger} from 'wampark'

// Plugins
import mongodb from '../plugins/mongodb.js'
import httpserver, {app} from '../plugins/httpserver.js'
import proxyWs from '../plugins/proxyws.js'
import containersManager from '../plugins/containersManager.js'
import httpErrorHandler from '../plugins/httpErrorHandler.js'

// Middlewares HTTP


// Rotas HTTP
import healthcheckRoutes from '../http/routes/healthcheck.routes.js';
import tenantRoutes from '../http/routes/tentant.routes.js';
import containersRoutes from '../http/routes/containers.routes.js';
import gatewayRoutes from '../http/routes/gateway.routes.js';

/**
 * Export Application instance
 */
export {
  application
}

export class Gateway {
  static instance = null
  constructor() {
    // super()
    if (Gateway.instance) {
      return Gateway.instance
    }
    Gateway.instance = this
    application.on('setup', this.setup.bind(this))
    application.gateway = this
    this.log = new ApplicationLogger('Gateway', 'Instance')

    this.log.info('Initializing Gateway')
  }

  setup () {
    this.installPlugins()
    this.configureRoutes()
  }


  installPlugins () {
    this.log.info('Install Plugins')
    // Instalar Plugins
    application.plugin(mongodb)
    application.plugin(httpserver)
    application.plugin(proxyWs)
    application.plugin(containersManager)
    application.plugin(httpErrorHandler)
  }

  configureRoutes () {
    this.log.info('Configure HTTP Routes')
    // HTTP Routes
    this.log.block('HTTP').info('/healthcheck')
    app.use('/healthcheck', healthcheckRoutes); // Healthcheck route
    this.log.block('REST').info('/tenant')
    app.use('/tenant', tenantRoutes); // Tenant routes
    this.log.block('REST').info('/containers')
    app.use('/containers', containersRoutes); // Containers routes
    this.log.block('GET').info('/gateway')
    app.use('/gateway', gatewayRoutes); // Gateway routes
    
  }
}

export default new Gateway();
