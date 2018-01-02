import {Module} from '../../src/decorators';
import {MockController} from './mock.controller';
import {MockService} from './mock.service';
import {Kernel} from '@rxstack/kernel';
import {AsyncEventDispatcher, asyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ConsoleLogger, Logger} from '@rxstack/logger';
import {Configuration} from '@rxstack/configuration';
import {Test1Module} from './test1.module';
import {ProviderDefinition} from '../../src/interfaces';
import {ServerManager} from '@rxstack/server-commons';
import {MockServer} from './mock.server';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: ServerManager, useClass: ServerManager },
  { provide: MockServer, useClass: MockServer },
  { provide: MockController, useClass: MockController },
  { provide: MockService, useClass: MockService },
  { provide: Kernel, useClass: Kernel },
  { provide: AsyncEventDispatcher, useValue: asyncEventDispatcher },
  // testing promise provider
  Promise.resolve({ provide: Logger, useClass: ConsoleLogger })
];

@Module({
  imports: [Test1Module],
  providers: APP_PROVIDERS,
  configuration: (config: Configuration) => {
    config.register('app', {
      type: 'object',
      properties: {
        name: {
          required: true,
          type: 'string'
        },
      }
    });
  }
})
export class AppModule {}