/**
 * @author Rafael Freitas
 * @created 2024-06-14 04:29:04
 */
import mongoose from 'mongoose'
import { v5 as _uuid } from 'uuid'

import common from '../_common/common.js'

const schema = new mongoose.Schema({
  // uuid: {
  //   type: String,
  // },

  /**
   * Nome do Tenant
   */
  name: {
    type: String,
    required: true
  },

  /**
   * 
   */
  databaseName: {
    type: String,
    required: true
  },

  /**
   * Path usado no proxy
   */
  domain: {
    type: String,
    required: true
  },

  /**
   * 
   */
  license: {
    type: String,
    required: true,
    default: 'no license'
  },

  active: {
    type: Boolean,
    default: true
  },

  suspended: {
    type: Boolean,
    default: false
  },

  /**
   * Flag para indicar se o tenat já foi instalado e configurado
   * Se não foi instalado redireciona para o setup do tenant para configurar
   * cada container para este tenant
   */
  installed: {
    type: Boolean,
    default: false
  },

  /**
   * Containers adicionados para este tenant
   */
  containers: [new mongoose.Schema({
    container: {
      type: String,
      ref: 'containers'
    },
    active: {
      type: Boolean,
      default: true
    },
    installed: {
      type: Boolean,
      default: false
    }
  })]
})

common(schema)

// Métodos de instância
// ----------------------------------------------


// Métodos de estáticos
// ----------------------------------------------

// Campos virtuais
// ----------------------------------------------


// Middleewares
// ----------------------------------------------

// schema.pre('validate', function (next) {
//   this.__id = this._id
//   this._id = this.getRegistroId()
//   this.uuid = _uuid(this._id, _uuid.URL)

//   if (typeof this.props === 'string') {
//     const result = durableJson(this.props)
//     this.props = JSON.parse(result.json)
//   }

//   next()
// })

// schema.pre('update', async function (next) {
//   if (this._update.nome || this._update.chave) {
//     this._update._id = this.model.createRegistroId(this._update)
//     this._update.uuid = _uuid(this._update._id, _uuid.URL)
//   }
//   next()
// })

// schema.pre('save', async function (next) {
//   // if (typeof this.props === 'string') {
//   //   const result = durableJson(this.props)
//   //   this.props = JSON.stringify(JSON.parse(result.json), null, 2)
//   // }

//   const { __id } = this

//   // this._id = this.getRegistroId()
//   // this.uuid = _uuid(this._id, _uuid.URL)

//   // se alterar o nome criar uma nova chave
//   if (!this.isNew && (this.isModified('nome') || this.isModified('chave'))) {
//     // remover registro antigo
//     // const uuid = this.uuid
//     const result = await this.constructor.deleteOne({ _id: __id })

//     const doc = { ...this._doc }
//     delete doc.__v
//     await this.constructor.update({ _id: this._id }, doc, { upsert: true, runValidators: false, setDefaultsOnInsert: false })
//     // throw new Error(`O _id do registro foi modificado.`)
//     return next(false)
//   }
//   next()
// })

// Plugins
// ----------------------------------------------


export default schema