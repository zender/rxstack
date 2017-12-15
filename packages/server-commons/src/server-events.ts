/**
 * Server Events
 */
export enum ServerEvents {
  // Dispatches when engine is initialized but routes are not configured
  PRE_CONFIGURE = 'server.pre_configure',
  // Dispatches when engine and routes are configured
  POST_CONFIGURE = 'server.post_configure',
  // Dispatched when user is connected (available only in socket servers).
  CONNECTED = 'server.connected',
  // Dispatched when user is connected (available only in socket servers).
  DISCONNECTED = 'server.disconnected',
}