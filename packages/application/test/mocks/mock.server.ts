
import {ServiceRegistry} from '@rxstack/service-registry';
import {AbstractServer, ServerManager} from '@rxstack/server-commons';
import {RouteDefinition} from '@rxstack/kernel';

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
  }
}