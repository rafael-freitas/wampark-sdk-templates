
import application, { Route, ApplicationError, RouteTypes } from "wampark"
import store from '../lib/MemoryStore.js'

/**
 * Subscribe wamp.session.on_leave event
 */
export default class WampSessionOnLeave extends Route {

  static {
    this.uri = 'wamp.session.on_leave'
    this.type = RouteTypes.PUBSUB
  }

  async endpoint ({args, kwargs, details}) {
    const [sessionid] = args
    await store.sessions.delete(sessionid)
  }

}
