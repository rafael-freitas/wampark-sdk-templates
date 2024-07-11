/**
 * @author Rafael Freitas
 * @created 2024-07-11 03:39:44
 * @class SessionsModel
 */
import mongoose from 'mongoose'
import schema from './schema.js'

export const COLLECTION_NAME = 'sessions'

export default mongoose.model(COLLECTION_NAME, schema)