
import ContainerStore from './ContainersStore.js';
import TenantsStore from './TenantsStore.js';

class MemoryStore {

  constructor() {
    this.collections = {};
    return new Proxy(this, {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop];
        }
        if (target.collections[prop]) {
          return target.collections[prop];
        }
        return undefined;
      },
    });
  }

  addCollection(name, storeInstance) {
    this.collections[name] = storeInstance;
  }

  getCollection(name) {
    return this.collections[name];
  }
}

// Inicialização da Store
const store = new MemoryStore();
store.addCollection('containers', ContainerStore);
store.addCollection('tenants', TenantsStore);

export default store;
