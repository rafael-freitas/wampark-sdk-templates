// store/containerStore.js
import CollectionStore from './CollectionStore.js';
import TenantsModel from '../db/tenants/TenantsModel.js';

class TenantsStore extends CollectionStore {
  constructor(model, cacheTTL) {
    super(model, cacheTTL);
  }

  async getByDomain(domain) {
    return this.getByField('domain', domain);
  }
}

export default new TenantsStore(TenantsModel, 86400, ['domain']); // Cache TTL de 24H
