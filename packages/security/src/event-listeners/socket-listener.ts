import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerEvents, SocketEvent} from '@rxstack/core';

@Injectable()
export class SocketListener {
  @Observe(ServerEvents.DISCONNECTED)
  async onDisconnect(event: SocketEvent): Promise<void> {
    if (event.socket['tokenTimeout']) {
      clearTimeout(event.socket['tokenTimeout']);
    }
  }
}
