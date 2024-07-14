import application, {ApplicationLogger} from "wampark";
import axios from "axios";

// plugins
// import mongodb from "../plugins/mongodb.js";
import httpserver, { app } from "../plugins/httpserver.js";

// http routes
import healthcheckRoutes from '../routes/http/healthcheck.routes.js';
import httpErrorHandler from '../plugins/httpErrorHandler.js'

class GatewayInterface {
  
  api = null;

  constructor () {
    this.api = this.getGatewayApi()
  }

  getGatewayHeaders () {
    const headers = {
      'x-secret-key': process.env.GATEWAY_SECRET_KEY,
      'x-container-id': process.env.CONTAINER_ID,
    };
    return headers
  }

  getGatewayApi () {
    const headers = this.getGatewayHeaders();
    const api = axios.create({
      baseURL: process.env.GATEWAY_URL,
      headers
    });
    return api
  }

  getContainerById (containerId) {
    return this.api.get(`/containers/${containerId}`)
  }

  getTenantByDomain (domain) {
    return this.api.get(`/tenant/domain/${domain}`)
  }
}

class Container {
  
  static instance = null;

  gateway = new GatewayInterface();

  constructor() {
    // super();
    if (Container.instance) {
      return Container.instance
    }
    Container.instance = this

    // default log for application
    this.log = new ApplicationLogger('Container', 'Instance')

    this.log.block('Id', process.env.CONTAINER_ID).info('Initializing Container')

    application.on('setup', this.setup.bind(this))
    application.container = this
    application.gateway = this.gateway
  }

  setup () {
    this.installDefaultPlugins()
    this.installDefaultRoutes()
    this.checkContainerFromGateway()
  }

  async checkContainerFromGateway () {
    const logBlock = this.log.block('Id', process.env.CONTAINER_ID)
    logBlock.info('Checking on Gateway')
    const container = await this.getContainer()
    
    logBlock
    .block('Name', container.name, 'magenta')
    .block('Active', container.active ? 'true' : 'false', 'green')
    .info('Gateway response OK')
  }

  installDefaultPlugins () {
    application.plugin(httpserver)
    application.plugin(httpErrorHandler)
  }

  installDefaultRoutes ()  {
    app.use('/healthcheck', healthcheckRoutes); // Healthcheck route
  }

  async getContainer () {
    const response = await this.gateway.getContainerById(process.env.CONTAINER_ID)
    return response.data
  }
  async getTenant (domain) {
    const response = await this.gateway.getTenantByDomain(domain)
    return response.data
  }
}

const container = new Container()


export default container

export {
  application
}