/**
 * @file Factory de conexão com MongoDB usando Mongoose
 * @version 1.0.0
 * @since 1.0.0
 * @author Rafael Freitas
 * @created 2024-06-18 13:10:06
 * @updated -
 */
// import { Worker, isMainThread, parentPort, workerData, threadId } from 'worker_threads'
import { EventEmitter } from 'events'
import application, { ApplicationError, ApplicationLogger } from 'wampark';
import mongoose from 'mongoose';

const DB_FACTORY_URI = process.env.DB_FACTORY_URI

export default class MongoConnectionFactory extends EventEmitter {

  static connections = new Map();

  connection = null

  static async getDatabaseConnection (database) {
    if (this.connections.has(database)) {
      return this.connections.get(database).connection
    }

    let adapter = new this({
      database: database
    })

    const connection = await adapter.createConnectionFromUri()

    this.connections.set(database, adapter)

    return connection
  }

  constructor (settings) {
    super()

    if (typeof settings === 'string') {
      settings = {
        database: settings
      }
    }

    /*
    validações / asserts
    ------------------------------------------------------------------------
    */
    ApplicationError.assert(DB_FACTORY_URI, 'MongoConnectionFactory#A001: Informe a URL da string de conexão no .env "DB_FACTORY_URI"')
    ApplicationError.assert.object(settings, 'MongoConnectionFactory#A002: Informe os parametros de conexão. "settings" deve ser um objeto')
    ApplicationError.assert(settings.database, 'MongoConnectionFactory#A003: "settings.database" deve ser informado')
    
    this.settings = settings

    this.log = new ApplicationLogger('Lib', 'MongoConnectionFactory')
  }

  getConnectionString () {
    let uri = DB_FACTORY_URI.replace('{database}', this.settings.database)
    return uri
  }

  createConnectionFromUri () {
    const {log} = this

    const connectionString = this.getConnectionString()

    this.settings.connectionString = connectionString

    // salvar conexão na instancia do WampAdapter
    this.connection = mongoose.createConnection(connectionString, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    })

    this.connection.on('connected', this.onConnected.bind(this));
    this.connection.on('disconnected', this.onDisconnected.bind(this));
    this.connection.on('error', this.onError.bind(this));

    return this.connection
  }

  onConnected () {
    const {log} = this
    
    log.block('Connection', this.settings.connectionString).info('Connected')

    // emitir evento de conexao aberta
    application.emit('db.mongoose.connected', this)
  }
  
  onDisconnected () {
    
  }
  
  onError (err) {
    // console.log(`Mongoose connection error to ${dbName}: `, err);
    // if (retries > 0) {
    //   retries -= 1;
    //   setTimeout(() => {
    //     console.log(`Retrying connection to ${dbName}...`);
    //     connection.openUri(dbUrl);
    //   }, 5000); // Tenta reconectar após 5 segundos
    // }
  }


}
