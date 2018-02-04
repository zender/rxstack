import {Module} from './decorators';
import {ModuleWithProviders} from './interfaces';
import {ApplicationConfiguration} from './application-configuration';
import {AsyncEventDispatcher} from '@rxstack//async-event-dispatcher';
import {ConsoleTransport, FileTransport, Logger} from '@rxstack/logger';
import {Kernel} from '@rxstack/kernel';
import {ServerManager} from '@rxstack/server-commons';
import {ChannelManager} from '@rxstack/channels';

@Module()
export class BootstrapModule {
  static configure(configuration: ApplicationConfiguration): ModuleWithProviders {
    return {
      module: BootstrapModule,
      providers: [
        { provide: AsyncEventDispatcher, useClass: AsyncEventDispatcher},
        { provide: Kernel, useClass: Kernel },
        { provide: ServerManager, useClass: ServerManager },
        { provide: ChannelManager, useClass: ChannelManager },
        { provide: FileTransport, useClass: FileTransport },
        { provide: ConsoleTransport, useClass: ConsoleTransport },
        {
          provide: Logger,
          useFactory: () => {
            return new Logger(configuration.logger.handlers);
          },
          deps: []
        }
      ]
    };
  }
}