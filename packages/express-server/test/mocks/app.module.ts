import {MockController} from './mock.controller';
import {Kernel} from '@rxstack/kernel';
import {ConsoleLogger, Logger} from '@rxstack/logger';
import {ServerManager} from '@rxstack/server-commons';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '../../src/express.module';
import {ConfiguratonListener} from './configuraton.listener';
import {Configuration, configuration} from '@rxstack/configuration';
import {AsyncEventDispatcher, asyncEventDispatcher} from '@rxstack/async-event-dispatcher';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: ServerManager, useClass: ServerManager },
  { provide: MockController, useClass: MockController },
  { provide: Kernel, useClass: Kernel },
  { provide: AsyncEventDispatcher, useValue: asyncEventDispatcher },
  { provide: Logger, useClass: ConsoleLogger },
  { provide: ConfiguratonListener, useClass: ConfiguratonListener },
  { provide: Configuration, useValue: configuration },
];

@Module({
  imports: [ExpressModule],
  providers: APP_PROVIDERS
})
export class AppModule {}