import {Module} from '../../../src/application/decorators';
import {MockController} from './mock.controller';
import {Test1Module} from './test1.module';
import {MockServer} from './mock.server';
import {BootstrapListener} from './bootstrap-listener';
import {ProviderDefinition} from '../../../src/application';
import {application_environment} from '../../environments/application_environment';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: BootstrapListener, useClass: BootstrapListener },
  { provide: MockServer, useClass: MockServer },
  { provide: MockController, useClass: MockController },
];

@Module({
  imports: [
    Test1Module.configure(application_environment.test_module_1)
  ],
  providers: APP_PROVIDERS,
})
export class AppModule {}
