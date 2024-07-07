/**
 * @author Rafael Freitas
 * @created 2024-06-14 04:29:04
 * @class TenantsModel
 */
import mongoose from 'mongoose'
import schema from './schema.js'

export const COLLECTION_NAME = 'tenants'

export default mongoose.model(COLLECTION_NAME, schema)