/**
 * @file Configuração da conexão com MongoDB usando Mongoose
 * @version 0.0.1
 * @since 0.0.0
 * @namespace plugins
 * @author Rafael Freitas
 * @created 2024-06-12
 * @updated -
 */

import mongoose from 'mongoose';
import Application, { ApplicationLogger } from 'wampark'

const log = new ApplicationLogger('Plugin', 'mongodb')

/**
 * Conecta ao banco de dados MongoDB.
 * @function
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async (connectionString) => {
  const logBlock = log.block('Connection', connectionString)
  try {
    logBlock.info(`Trying to connect`)
    await mongoose.connect(connectionString, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    logBlock.info(`Connected`)
    Application.emit('db.mongoose.connected')
  } catch (err) {
    logBlock.error(`Fail to connect to DB Error: ${err.toString()}`)
    process.exit(1);
  }
};

export default {
  install () {},
  start () {
    connectDB(process.env.DB_URI)
  }
};