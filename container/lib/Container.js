// Container.js

import application, { ApplicationLogger } from "wampark";
import axios from "axios";
import httpserver, { app } from "../plugins/httpserver.js";
import healthcheckRoutes from '../routes/http/healthcheck.routes.js';
import httpErrorHandler from '../plugins/httpErrorHandler.js';

/**
 * Gateway Interface for API interactions
 */
class GatewayInterface {
  api = null;

  constructor() {
    this.api = this.getGatewayApi();
  }

  /**
   * Get headers required for the gateway API
   * @returns {Object} Headers object
   */
  getGatewayHeaders() {
    const headers = {
      'x-secret-key': process.env.GATEWAY_SECRET_KEY,
      'x-container-id': process.env.CONTAINER_ID,
    };
    return headers;
  }

  /**
   * Initialize the gateway API instance
   * @returns {Object} Axios instance
   */
  getGatewayApi() {
    const headers = this.getGatewayHeaders();
    const api = axios.create({
      baseURL: process.env.GATEWAY_URL,
      headers
    });
    return api;
  }

  /**
   * Get container by its ID
   * @param {string} containerId - Container ID
   * @returns {Promise<Object>} Container data
   */
  getContainerById(containerId) {
    return this.api.get(`/containers/${containerId}`);
  }

  /**
   * Get tenant by its domain
   * @param {string} domain - Tenant domain
   * @returns {Promise<Object>} Tenant data
   */
  getTenantByDomain(domain) {
    return this.api.get(`/tenants/domain/${domain}`);
  }

  /**
   * Add a container to a tenant
   * @param {string} tenantId - Tenant ID
   * @param {Object} container - Container data
   * @returns {Promise<Object>} API response
   */
  addContainerToTenant(tenantId, container) {
    return this.api.put(`/tenants/${tenantId}/containers`, container);
  }

  /**
   * Remove a container from a tenant
   * @param {string} tenantId - Tenant ID
   * @param {string} containerId - Container ID
   * @returns {Promise<Object>} API response
   */
  removeContainerFromTenant(tenantId, containerId) {
    return this.api.delete(`/tenants/${tenantId}/containers/${containerId}`);
  }

  /**
   * Update a container in a tenant
   * @param {string} tenantId - Tenant ID
   * @param {string} containerId - Container ID
   * @param {Object} container - Container data
   * @returns {Promise<Object>} API response
   */
  updateContainerInTenant(tenantId, containerId, container) {
    return this.api.put(`/tenants/${tenantId}/containers/${containerId}`, container);
  }
}

/**
 * Container class for managing container operations
 */
class Container {
  static instance = null;

  gateway = new GatewayInterface();

  constructor() {
    if (Container.instance) {
      return Container.instance;
    }
    Container.instance = this;

    this.log = new ApplicationLogger('Container', 'Instance');
    this.log.block('Id', process.env.CONTAINER_ID).info('Initializing Container');

    application.on('setup', this.setup.bind(this));
    application.container = this;
    application.gateway = this.gateway;
  }

  setup() {
    this.installDefaultPlugins();
    this.installDefaultRoutes();
    this.checkContainerFromGateway();
  }

  /**
   * Check the container status from the gateway
   * @async
   */
  async checkContainerFromGateway() {
    const logBlock = this.log.block('Id', process.env.CONTAINER_ID);
    logBlock.info('Checking on Gateway');
    const container = await this.getContainer();

    logBlock
      .block('Name', container.name, 'magenta')
      .block('Active', container.active ? 'true' : 'false', 'green')
      .info('Gateway response OK');
  }

  installDefaultPlugins() {
    application.plugin(httpserver);
    application.plugin(httpErrorHandler);
  }

  installDefaultRoutes() {
    app.use('/healthcheck', healthcheckRoutes); // Healthcheck route
  }
  
  async getContainer() {
    const response = await this.gateway.getContainerById(process.env.CONTAINER_ID);
    return response.data;
  }

  async getTenant(domain) {
    const response = await this.gateway.getTenantByDomain(domain);
    return response.data;
  }

  /**
   * Add a container to a tenant using the gateway API
   * @param {string} tenantId - Tenant ID
   * @param {Object} container - Container data
   * @returns {Promise<Object>} Updated tenant data
   */
  async addContainerToTenant(tenantId, container) {
    const response = await this.gateway.addContainerToTenant(tenantId, container);
    return response.data;
  }

  /**
   * Remove a container from a tenant using the gateway API
   * @param {string} tenantId - Tenant ID
   * @param {string} containerId - Container ID
   * @returns {Promise<Object>} Updated tenant data
   */
  async removeContainerFromTenant(tenantId, containerId) {
    const response = await this.gateway.removeContainerFromTenant(tenantId, containerId);
    return response.data;
  }

  /**
   * Update a container in a tenant using the gateway API
   * @param {string} tenantId - Tenant ID
   * @param {string} containerId - Container ID
   * @param {Object} container - Container data
   * @returns {Promise<Object>} Updated tenant data
   */
  async updateContainerInTenant(tenantId, containerId, container) {
    const response = await this.gateway.updateContainerInTenant(tenantId, containerId, container);
    return response.data;
  }
}

const container = new Container();

export default container;
export { application };
