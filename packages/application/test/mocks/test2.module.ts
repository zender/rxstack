import {Module} from '../../src/decorators';
import {InjectionToken, Provider} from 'injection-js';
import {MockService} from './mock.service';

export const MOCK_SERVICE_2 = new InjectionToken('mock.service2');

const APP_PROVIDERS: Provider[] = [
  { provide: MOCK_SERVICE_2, useClass: MockService },
];

@Module({
  providers: APP_PROVIDERS,
})
export class Test2Module {}