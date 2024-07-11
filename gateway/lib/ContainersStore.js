// store/containerStore.js
import CollectionStore from './CollectionStore.js';
import ContainersModel from '../db/containers/ContainersModel.js';

class ContainerStore extends CollectionStore {
  constructor(model, cacheTTL) {
    super(model, cacheTTL);
  }

  async getByPath(path) {
    return this.getByField('path', path);
  }

  async getByStaticPath(staticPath) {
    return this.getByField('staticPath', staticPath);
  }
}

export default new ContainerStore(ContainersModel, 86400, ['path', 'staticPath']); // Cache TTL de 24H
