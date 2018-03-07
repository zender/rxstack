import {Module} from '../../../src/application/decorators';
import {MockService} from './mock.service';
import {Test2Module} from './test2.module';
import {ModuleWithProviders} from '../../../src/application/interfaces';

export interface Test1ModuleConfiguration {
  name: string;
}

@Module()
export class Test1Module {
  static configure(config: Test1ModuleConfiguration): ModuleWithProviders {
    return {
      module: Test1Module,
      imports: [Test2Module],
      providers: [
        { provide: MockService, useClass: MockService },
      ]
    };
  }
}