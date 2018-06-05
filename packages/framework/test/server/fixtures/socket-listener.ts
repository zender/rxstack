import {ServerEvents, SocketEvent} from '../../../src/server';
import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';

@Injectable()
export class SocketListener {
  connected = false;

  @Observe(ServerEvents.CONNECTED)
  async onConnect(event: SocketEvent): Promise<void> {
    this.connected = true;
  }
}