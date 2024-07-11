

import lodash from 'lodash'
import application, { Route, ApplicationError } from "wampark"
import store from '../lib/MemoryStore.js'

export default class AppSessionSetRoute extends Route {

  static {
    this.uri = 'app.session.set'
  }

  async endpoint ({args, kwargs, details}) {
    const [sessionid, key, value] = args
    const {log} = this.constructor

    ApplicationError.assert(sessionid, 'A001: sessionid is required')
    ApplicationError.assert.string(key, 'A002: key must be a string')

    let session = await store.sessions.get(sessionid)
    let sessionData = {}

    if (session) {
      sessionData = session.data
    }
    lodash.set(sessionData, key, value)

    await store.sessions.update(sessionid, {data: sessionData})
  }

}
