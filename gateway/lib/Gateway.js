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
import httpErrorHandler from '../plugins/httpErrorHandler/httpErrorHandler.js'

// Middlewares HTTP


// Rotas HTTP
import healthcheckRoutes from '../routes/http/healthcheck.routes.js';
import tenantRoutes from '../routes/http/tentants.routes.js';
import containersRoutes from '../routes/http/containers.routes.js';
import gatewayRoutes from '../routes/http/gateway.routes.js';

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
    const logBlock = this.log.block('HTTP')
    // HTTP Routes
    logBlock.block('GET', '/healthcheck').info('Routes added')
    app.use(healthcheckRoutes); // Healthcheck route
    logBlock.block('REST', '/tenants').info('Routes added')
    app.use(tenantRoutes); // Tenant routes
    logBlock.block('REST', '/containers').info('Routes added')
    app.use(containersRoutes); // Containers routes
    logBlock.block('REST', '/gateway').info('Routes added')
    app.use(gatewayRoutes); // Gateway routes
    
  }
}

export default new Gateway();
