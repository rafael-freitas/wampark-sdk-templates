// store/containerStore.js
import CollectionStore from './CollectionStore.js';
import SessionsModel from '../db/sessions/SessionsModel.js';

class ContainerStore extends CollectionStore {
  constructor(model, cacheTTL) {
    super(model, cacheTTL);
  }
}

export default new ContainerStore(SessionsModel, 86400); // Cache TTL de 24H
