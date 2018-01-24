import {AsyncEventDispatcher} from '@rxstack//async-event-dispatcher';
import {ConsoleLogger, Logger} from '@rxstack/logger';
import {Kernel} from '@rxstack/kernel';
import {ServerManager} from '@rxstack/server-commons';
import {Provider} from 'injection-js';
import {ChannelManager} from '@rxstack/channels';

export const CORE_PROVIDERS: Provider[] = [
  { provide: AsyncEventDispatcher, useClass: AsyncEventDispatcher},
  { provide: Logger, useClass: ConsoleLogger },
  { provide: Kernel, useClass: Kernel },
  { provide: ServerManager, useClass: ServerManager },
  { provide: ChannelManager, useClass: ChannelManager }
];