import {ServiceRegistry} from '@rxstack/service-registry';
import {AbstractServer, ServerManager} from '../../../src/server';
import {RouteDefinition} from '../../../src/kernel';
import {Injectable} from 'injection-js';

@ServiceRegistry(ServerManager.ns, 'server.mock')
@Injectable()
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