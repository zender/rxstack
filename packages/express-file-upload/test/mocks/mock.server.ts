import {RouteDefinition} from '@rxstack/kernel';
import * as http from 'http';
import {ServiceRegistry} from '@rxstack/service-registry';
import {AbstractServer, ServerConfigurationEvent, ServerEvents, ServerManager} from '@rxstack/server-commons';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Injectable} from 'injection-js';

@Injectable()
@ServiceRegistry(ServerManager.ns, 'server.mock')
export class MockServer extends AbstractServer {
  protected async configure(routeDefinitions: RouteDefinition[]): Promise<void> {
    this.host = 'localhost';
    this.port = 4242;
    this.engine = 'my engine';
    this.httpServer = http.createServer();
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    await dispatcher
      .dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this.engine, this.engine));
  }
}