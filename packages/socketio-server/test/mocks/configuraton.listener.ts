import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents, SocketEvent} from '@rxstack/server-commons';
import {Injectable, Injector} from 'injection-js';
import {socketMiddleware} from './socketio.middleware';
import {SocketIOServer} from '../../src/socketio.server';
import Socket = SocketIO.Socket;

@Injectable()
export class ConfiguratonListener {

  private injector: Injector;

  private connectedUsers: Socket[] = [];

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @Observe(ServerEvents.CONFIGURE)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.name !== SocketIOServer.serverName) {
      return;
    }
    event.engine
      .use(socketMiddleware(this.injector))
    ;
  }

  @Observe(ServerEvents.CONNECTED)
  async onConnect(event: SocketEvent): Promise<void> {
    if (event.name !== SocketIOServer.serverName) {
      return;
    }

    this.connectedUsers.push(event.socket);
  }

  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: SocketEvent): Promise<void> {
    if (event.name !== SocketIOServer.serverName) {
      return;
    }

    // do something
  }
}