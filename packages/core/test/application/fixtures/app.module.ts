import {Module} from '../../../src/application/decorators';
import {MockServer} from './mock.server';
import {BootstrapListener} from './bootstrap-listener';
import {ProviderDefinition} from '../../../src/application';
import {SERVER_REGISTRY} from '../../../src/server';
import {app_environment} from '../../environments/app_environment';
import {Test1Module} from './test1.module';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: BootstrapListener, useClass: BootstrapListener },
  { provide: SERVER_REGISTRY, useClass: MockServer, multi: true },
];

@Module({
  imports: [Test1Module.configure(app_environment.test_module_1)],
  providers: APP_PROVIDERS,
})
export class AppModule {}
