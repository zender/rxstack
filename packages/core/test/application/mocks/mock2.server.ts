import {ServiceRegistry} from '@rxstack/service-registry';
import {AbstractServer, ServerManager} from '../../../src/server';
import {RouteDefinition} from '../../../src/kernel';

@ServiceRegistry(ServerManager.ns, 'server.mock2')
export class MockServer2 extends AbstractServer {
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
    this.port = 9090;
  }
}