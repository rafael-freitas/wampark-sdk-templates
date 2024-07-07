/**
 * @author Rafael Freitas
 * @created 2024-06-14 04:29:04
 */
import mongoose from 'mongoose'
import schemaLogs from '../_schemas/schema.logs.js'
import common from '../_common/common.js'

const { ObjectId } = mongoose.Schema.Types

const schema = new mongoose.Schema({
  /**
   * Documento do log
   */
  documento: {
    type: ObjectId,
    ref: 'documentos',
    required: true,
  },
})

schema.add(schemaLogs)



common(schema)

// Métodos de instância
// ----------------------------------------------


// Métodos de estáticos
// ----------------------------------------------


// Campos virtuais
// ----------------------------------------------


// Plugins
// ----------------------------------------------


export default schema