

import lodash from 'lodash'
import application, { Route, ApplicationError } from "wampark"
import store from '../../lib/MemoryStore.js'

export default class AppSessionGetRoute extends Route {

  static {
    this.uri = 'app.session.get'
  }

  async endpoint ({args, kwargs, details}) {
    const [sessionid, key] = args
    const {log} = this.constructor

    ApplicationError.assert(sessionid, 'A001: sessionid is required')
    ApplicationError.assert.string(key, 'A001: key must be a string')

    let session = await store.sessions.get(sessionid)

    return lodash.get(session?.data, key)
  }

}
