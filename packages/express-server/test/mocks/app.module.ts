import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '../../src/express.module';
import {ConfigurationListener} from './configuration.listener';
import {environment} from '../environments/environment';
import {BootstrapModule} from '@rxstack/application';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: ConfigurationListener, useClass: ConfigurationListener },
];

@Module({
  imports: [
    BootstrapModule.configure(environment),
    ExpressModule.configure(environment.express_server),

  ],
  providers: APP_PROVIDERS
})
export class AppModule {}