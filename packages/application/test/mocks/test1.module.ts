import {Module} from '../../src/decorators';
import {InjectionToken, Provider} from 'injection-js';
import {MockService} from './mock.service';
import {Test2Module} from './test2.module';
import {Configuration} from '@rxstack/configuration';

export const MOCK_SERVICE_1 = new InjectionToken('mock.service1');

const APP_PROVIDERS: Provider[] = [
  { provide: MOCK_SERVICE_1, useClass: MockService },
];

@Module({
  imports: [Test2Module],
  providers: APP_PROVIDERS,
})
export class Test1Module {
  static configure(config: any): void {

  }
}