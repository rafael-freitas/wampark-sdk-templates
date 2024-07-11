/**
 * @author Rafael Freitas
 * @created 2024-06-14 04:29:04
 */
import mongoose from 'mongoose'
import { v5 as _uuid } from 'uuid'

import common from '../_common/common.js'

const schema = new mongoose.Schema({

  data: {
    type: Object,
    default: () => {
      return {}
    }
  },
})

common(schema)

export default schema