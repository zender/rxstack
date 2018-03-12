import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '../../../src/application/interfaces';

@Injectable()
export class MockService implements InjectorAwareInterface {
  injector: Injector;
  modifiedByBootstrapEvent = false;

  constructor() {}

  setInjector(injector: Injector): void {
    this.injector = injector;
  }
}