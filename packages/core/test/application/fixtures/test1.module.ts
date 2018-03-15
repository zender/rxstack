import {Module} from '../../../src/application/decorators';
import {Test2Module} from './test2.module';
import {ModuleWithProviders} from '../../../src/application/interfaces';
import {Service2} from './service2';

export class Test1ModuleConfiguration {
  name: string;
}

@Module()
export class Test1Module {
  static configure(config: Test1ModuleConfiguration): ModuleWithProviders {
    return {
      module: Test1Module,
      imports: [Test2Module],
      providers: [
        { provide: Test1ModuleConfiguration, useValue: config },
        { provide: Service2, useClass: Service2 },
      ]
    };
  }
}