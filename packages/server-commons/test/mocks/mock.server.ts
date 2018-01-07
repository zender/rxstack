import {AbstractServer} from '../../src/abstract-server';
import {ServiceRegistry} from '@rxstack/service-registry';
import {ServerManager} from '../../src/server-manager';
import {RouteDefinition} from '@rxstack/kernel';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ServerEvents} from '../../src/server-events';
import {ServerConfigurationEvent} from '../../src/server-configuration.event';
import * as http from 'http';

@ServiceRegistry(ServerManager.ns, 'server.mock')
export class MockServer extends AbstractServer {
  protected async configure(routeDefinitions: RouteDefinition[]): Promise<void> {
    this.host = 'localhost';
    this.port = 4242;
    this.engine = 'my engine';

    const dispatcher = this.injector.get(AsyncEventDispatcher);
    await dispatcher.dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this.getEngine(), 'mock'));
    this.httpServer = http.createServer();
  }
}