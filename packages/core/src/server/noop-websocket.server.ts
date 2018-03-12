import {Injectable} from 'injection-js';
import {AbstractServer} from './abstract-server';
import {Transport, WebSocketDefinition} from '../kernel';

@Injectable()
export class NoopWebsocketServer extends AbstractServer {
  getEngine(): any { }

  async startEngine(): Promise<void> { }

  async stopEngine(): Promise<void> { }

  getName(): string {
    return 'noop-websocket';
  }

  getTransport(): Transport {
    return 'SOCKET';
  }

  protected async configure(routeDefinitions: WebSocketDefinition[]): Promise<void> { }
}