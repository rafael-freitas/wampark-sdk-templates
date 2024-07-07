/**
 * Campos comuns para todas as collections
 * @version 0.0.0
 * @since 0.0.0
 * @namespace db.models.common
 * @author Rafael Freitas
 * @created 2024-06-14 03:59:34
 */

import mongoose from 'mongoose'
import { v4 as _uuid } from 'uuid'

const schema = new mongoose.Schema({

  /**
   * UUID do registro
   * @type {String}
   */
  _id: {
    type: String,
    default () {
      return _uuid()
    }
  },

  /**
   * Propriedade define se o documento está ativo.
   * @type {Boolean}
   * @default true
   */
  active: {
    type: Boolean,
    default: true
  },

  /**
   * Propriedade armazena a data que o documento foi criado
   * @type {Date}
   * @default Date.now() timestamp com a data atual em milisegundos
   */
  createdAt: {
    type: Date,
    default: () => Date.now()
  },

  /**
   * Propriedade armazena a data que da última alteração do documento
   * @type {Date}
   * @default Date.now() timestamp com a data atual em milisegundos
   */
  updatedAt: {
    type: Date,
  },
  
})

export default schema