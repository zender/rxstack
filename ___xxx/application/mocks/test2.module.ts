import {Module} from '../../../src/application/decorators';
import {Provider} from 'injection-js';
import {MockService2} from './mock.service2';

const APP_PROVIDERS: Provider[] = [
  { provide: MockService2, useClass: MockService2 },
];

@Module({
  providers: APP_PROVIDERS,
})
export class Test2Module {}