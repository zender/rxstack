import {Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '../../src/interfaces';

@Injectable()
export class MockService implements InjectorAwareInterface {
  injector: Injector;
  modifiedByBootstrapEvent = false;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }
}