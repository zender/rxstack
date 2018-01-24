import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '../../src/express.module';
import {ConfigurationListener} from './configuration.listener';
import {environment} from '../environments/environment';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: ConfigurationListener, useClass: ConfigurationListener },
];

@Module({
  imports: [ExpressModule.configure(environment.express_server)],
  providers: APP_PROVIDERS
})
export class AppModule {}