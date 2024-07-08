/**
 * Aplica o schema base
 * @version 0.0.0
 * @since 0.0.0
 * @namespace db.models.common
 * @author Rafael Freitas
 * @created 2024-03-18 09:38:20
 */
import baseFields from '../_schemas/schema.common.js'

/**
 *
 * @param Schema
 * @param types Array de campos passados por parametro ex: types(Schema, Campo1, Campo2...)
 */
export default function addCommonFields (Schema, ...fields) {
  fields.push(baseFields)

  for (const field of fields) {
    Schema.add(field)
  }

  return Schema
}
