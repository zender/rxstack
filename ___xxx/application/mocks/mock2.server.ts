import {AbstractServer} from '../../../src/server';
import {RouteDefinition} from '../../../src/kernel';
import {Injectable} from 'injection-js';

@Injectable()
export class MockServer2 extends AbstractServer {
  started = false;
  getEngine(): any { }
  async startEngine(): Promise<void> {
    this.started = true;
  }
  async stopEngine(): Promise<void> {
    this.started = false;
  }

  getName(): string {
    return 'mock2';
  }

  protected async configure(routeDefinitions: RouteDefinition[]): Promise<void> {
    this.host = 'example.com';
    this.port = 9090;
  }
}