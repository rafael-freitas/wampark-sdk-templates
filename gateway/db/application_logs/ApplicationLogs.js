/**
 * @author Rafael Freitas
 * @created 2024-06-14 04:29:04
 * @class ApplicationLogs
 */
import mongoose from 'mongoose'
import schema from './schema.js'

export const COLLECTION_NAME = 'application_logs'

export default mongoose.model(COLLECTION_NAME, schema)