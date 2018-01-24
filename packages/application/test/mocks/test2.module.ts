import {Module} from '../../src/decorators';
import {Provider} from 'injection-js';
import {MockService} from './mock.service';

const APP_PROVIDERS: Provider[] = [
  { provide: 'mock.service2', useClass: MockService },
];

@Module({
  providers: APP_PROVIDERS,
})
export class Test2Module {}