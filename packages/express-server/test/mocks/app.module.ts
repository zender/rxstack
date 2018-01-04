import {MockController} from './mock.controller';
import {ServerManager} from '@rxstack/server-commons';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '../../src/express.module';
import {ConfiguratonListener} from './configuraton.listener';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: ServerManager, useClass: ServerManager },
  { provide: MockController, useClass: MockController },
  { provide: ConfiguratonListener, useClass: ConfiguratonListener },
];

@Module({
  imports: [ExpressModule],
  providers: APP_PROVIDERS
})
export class AppModule {}