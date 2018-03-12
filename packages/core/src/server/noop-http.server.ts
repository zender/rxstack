import {Injectable} from 'injection-js';
import {AbstractServer} from './abstract-server';
import {HttpDefinition, Transport} from '../kernel';

@Injectable()
export class NoopHttpServer extends AbstractServer {
  getEngine(): any { }

  async startEngine(): Promise<void> { }

  async stopEngine(): Promise<void> { }

  getName(): string {
    return 'noop-http';
  }

  getTransport(): Transport {
    return 'HTTP';
  }

  protected async configure(routeDefinitions: HttpDefinition[]): Promise<void> { }
}