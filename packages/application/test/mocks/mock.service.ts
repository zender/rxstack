import {Inject, Injectable, Injector} from 'injection-js';
import {InjectorAwareInterface} from '../../src/interfaces';
import {Test1ModuleConfiguration} from './test1.module';

@Injectable()
export class MockService implements InjectorAwareInterface {
  injector: Injector;
  modifiedByBootstrapEvent = false;

  constructor(@Inject('test1.config') public config: Test1ModuleConfiguration) {}

  setInjector(injector: Injector): void {
    this.injector = injector;
  }
}