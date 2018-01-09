import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '../../src/express.module';
import {ConfigurationListener} from './configuration.listener';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: ConfigurationListener, useClass: ConfigurationListener },
];

@Module({
  imports: [ExpressModule],
  providers: APP_PROVIDERS
})
export class AppModule {}