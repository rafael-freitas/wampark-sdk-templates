// store/collectionStore.js
export default class CollectionStore {
  constructor(model, cacheTTL = 60000, indexedFields = []) {
    this.model = model;
    this.memoryStore = new Map();
    this.valueStore = new Map();
    this.cacheTTL = cacheTTL;
    this.indexes = {}; // Índices para campos específicos
    this.indexedFields = indexedFields; // Campos específicos a serem indexados

    // Initialize hooks
    this.beforeCreate = async (data) => {};
    this.afterCreate = async (data) => {};
    this.beforeUpdate = async (id, updateData) => {};
    this.afterUpdate = async (id, updateData) => {};
    this.beforeDelete = async (id) => {};
    this.afterDelete = async (id) => {};

    // Inicializar índices
    this.indexedFields.forEach(field => {
      this._createIndex(field);
    });
  }

  _isCacheValid(entry) {
    const now = Date.now();
    return (now - entry.timestamp) < this.cacheTTL;
  }

  _createIndex(field) {
    if (!this.indexes[field]) {
      this.indexes[field] = new Map();
    }
  }

  async create(data) {
    await this.beforeCreate(data); // Hook before create

    const doc = new this.model(data);
    const savedDoc = await doc.save();
    this.memoryStore.set(savedDoc._id.toString(), { data: savedDoc, timestamp: Date.now() });

    // Atualizar índices
    this.indexedFields.forEach(field => {
      if (data[field]) {
        this._createIndex(field);
        this.indexes[field].set(data[field], savedDoc._id.toString());
      }
    });

    await this.afterCreate(savedDoc); // Hook after create

    return savedDoc;
  }

  async get(id) {
    if (this.memoryStore.has(id)) {
      const entry = this.memoryStore.get(id);
      if (this._isCacheValid(entry)) {
        return entry.data;
      } else {
        this.memoryStore.delete(id);
      }
    }
    const doc = await this.model.findById(id);
    if (doc) {
      this.memoryStore.set(id, { data: doc, timestamp: Date.now() });
    }
    return doc;
  }

  async find(query = {}) {
    const docs = await this.model.find(query);
    docs.forEach(doc => this.memoryStore.set(doc._id.toString(), { data: doc, timestamp: Date.now() }));
    return docs;
  }

  async update(id, updateData) {
    await this.beforeUpdate(id, updateData); // Hook before update

    // Remover índices antigos
    const existingDoc = await this.get(id);
    this.indexedFields.forEach(field => {
      if (existingDoc && existingDoc[field]) {
        this.indexes[field].delete(existingDoc[field]);
      }
    });

    const updatedDoc = await this.model.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (updatedDoc) {
      this.memoryStore.set(id, { data: updatedDoc, timestamp: Date.now() });

      // Atualizar índices com novos valores
      this.indexedFields.forEach(field => {
        if (updatedDoc[field]) {
          this._createIndex(field);
          this.indexes[field].set(updatedDoc[field], updatedDoc._id.toString());
        }
      });
    }
    await this.afterUpdate(id, updateData); // Hook after update
    return updatedDoc;
  }

  async delete(id) {
    await this.beforeDelete(id); // Hook before delete

    const deletedDoc = await this.model.findByIdAndDelete(id);
    if (deletedDoc) {
      this.memoryStore.delete(id);

      // Remover dos índices
      this.indexedFields.forEach(field => {
        if (deletedDoc[field]) {
          this.indexes[field].delete(deletedDoc[field]);
        }
      });
      this.valueStore.delete(id);
    }

    await this.afterDelete(id); // Hook after delete
    return deletedDoc;
  }

  async getByField(field, value) {
    this._createIndex(field);

    const id = this.indexes[field]?.get(value);
    if (id && this.memoryStore.has(id)) {
      const entry = this.memoryStore.get(id);
      if (this._isCacheValid(entry)) {
        return entry.data
      } else {
        this.memoryStore.delete(id);
        this.indexes[field].delete(value);
      }
    }

    const query = {};
    query[field] = value;
    const doc = await this.model.findOne(query);
    if (doc) {
      this.memoryStore.set(doc._id.toString(), { data: doc, timestamp: Date.now() });
      this.indexes[field].set(value, doc._id.toString());
      return doc;
    }
    return null;
  }

  setValue(id, key, value) {
    if (!this.valueStore.has(id)) {
      this.valueStore.set(id, new Map());
    }
    this.valueStore.get(id).set(key, value);
  }

  getValue(id, key) {
    if (this.valueStore.has(id)) {
      return this.valueStore.get(id).get(key);
    }
    return null;
  }

  deleteValue(id, key) {
    if (this.valueStore.has(id)) {
      this.valueStore.get(id).delete(key);
    }
  }
}
