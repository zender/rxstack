import {AbstractServer} from '../../../src/server';
import {RouteDefinition} from '../../../src/kernel';
import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '../../../src/application';

@Injectable()
export class MockServer extends AbstractServer implements InjectorAwareInterface {
  injector: Injector;
  started = false;
  setInjector(injector: Injector): void {
    this.injector = injector;
  }
  getEngine(): any { }
  async startEngine(): Promise<void> {
    this.started = true;
  }
  async stopEngine(): Promise<void> {
    this.started = false;
  }

  getName(): string {
    return 'mock';
  }

  protected async configure(routeDefinitions: RouteDefinition[]): Promise<void> {
    this.host = 'example.com';
    this.port = 8080;
  }
}