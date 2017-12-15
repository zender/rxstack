import {AbstractServer} from '../../src/abstract-server';
import {ServiceRegistry} from '@rxstack/service-registry';
import {ServerManager} from '../../src/server-manager';
import {RouteDefinition} from '@rxstack/kernel';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ServerEvents} from '../../src/server-events';
import {ServerConfigurationEvent} from '../../src/server-configuration.event';

@ServiceRegistry(ServerManager.ns, 'server.mock')
export class MockServer extends AbstractServer {
  started = false;
  getEngine(): any { }
  async startEngine(): Promise<void> {
    this.started = true;
  }
  async stopEngine(): Promise<void> {
    this.started = false;
  }

  protected async configure(routeDefinitions: RouteDefinition[]): Promise<void> {
    this.host = 'example.com';
    this.port = 8080;

    const dispatcher = this.injector.get(AsyncEventDispatcher);
    await dispatcher.dispatch(ServerEvents.PRE_CONFIGURE, new ServerConfigurationEvent(this));
    await dispatcher.dispatch(ServerEvents.POST_CONFIGURE, new ServerConfigurationEvent(this));
  }
}