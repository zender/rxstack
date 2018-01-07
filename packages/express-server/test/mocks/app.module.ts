import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '../../src/express.module';
import {ConfiguratonListener} from './configuraton.listener';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: ConfiguratonListener, useClass: ConfiguratonListener },
];

@Module({
  imports: [ExpressModule],
  providers: APP_PROVIDERS
})
export class AppModule {}