import {Injectable} from 'injection-js';
import {AbstractServer} from './abstract-server';
import {RouteDefinition} from '../kernel';

@Injectable()
export class NoopServer extends AbstractServer {
  getEngine(): any { }

  async startEngine(): Promise<void> { }

  async stopEngine(): Promise<void> { }

  getName(): string {
    return 'noop';
  }

  protected async configure(routeDefinitions: RouteDefinition[]): Promise<void> { }
}