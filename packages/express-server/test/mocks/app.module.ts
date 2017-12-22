import {MockController} from './mock.controller';
import {Kernel} from '@rxstack/kernel';
import {AsyncEventDispatcher, asyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ConsoleLogger, Logger} from '@rxstack/logger';
import {ServerManager} from '@rxstack/server-commons';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '../../src/express.module';
import {Configuration, configuration} from '@rxstack/configuration';
import {ConfiguratonListener} from './configuraton.listener';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: ServerManager, useClass: ServerManager },
  { provide: MockController, useClass: MockController },
  { provide: Kernel, useClass: Kernel },
  { provide: AsyncEventDispatcher, useValue: asyncEventDispatcher },
  { provide: Logger, useClass: ConsoleLogger },
  { provide: Configuration, useValue: configuration },
  { provide: ConfiguratonListener, useValue: ConfiguratonListener },
];

@Module({
  imports: [ExpressModule],
  providers: APP_PROVIDERS,
})
export class AppModule {}