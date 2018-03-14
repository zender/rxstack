import {Injectable} from 'injection-js';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import * as http from 'http';
import {AbstractServer, ServerConfigurationEvent, ServerEvents} from '../../../src/server';
import {HttpDefinition, Transport} from '../../../src/kernel';

@Injectable()
export class TestServer extends AbstractServer {

  getName(): string {
    return 'test-http';
  }

  getTransport(): Transport {
    return 'HTTP';
  }

  protected async configure(routeDefinitions: HttpDefinition[]): Promise<void> {
    this.httpServer = http.createServer();
    this.engine = 'test';
    this.host = 'localhost';
    this.port = 4000;

    await this.injector.get(AsyncEventDispatcher)
      .dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this));
  }
}