import {Injectable, Injector} from 'injection-js';

@Injectable()
export class MockService {
  injector: Injector;
  modifiedByBootstrapEvent = false;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }
}