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

export default new ContainerStore(ContainersModel, 60000, ['path', 'staticPath']); // Cache TTL de 60 segundos
