import {Module} from '../../src/decorators';
import {MockController} from './mock.controller';
import {Test1Module} from './test1.module';
import {ProviderDefinition} from '../../src/interfaces';
import {MockServer} from './mock.server';
import {BootstrapListener} from './bootstrap-listener';
import {environment} from '../environments/environment';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: BootstrapListener, useClass: BootstrapListener },
  { provide: MockServer, useClass: MockServer },
  { provide: MockController, useClass: MockController },
];

@Module({
  imports: [Test1Module.configure(environment.test_module_1)],
  providers: APP_PROVIDERS,
})
export class AppModule {}