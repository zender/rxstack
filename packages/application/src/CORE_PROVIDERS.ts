import {AsyncEventDispatcher, asyncEventDispatcher} from '@rxstack//async-event-dispatcher';
import {Configuration, configuration} from '@rxstack/configuration';
import {ConsoleLogger, Logger} from '@rxstack/logger';
import {Kernel} from '@rxstack/kernel';
import {ServerManager} from '@rxstack/server-commons';
import {Provider} from 'injection-js';

export const CORE_PROVIDERS: Provider[] = [
  { provide: AsyncEventDispatcher, useValue: asyncEventDispatcher },
  { provide: Configuration, useValue: configuration },
  { provide: Logger, useClass: ConsoleLogger },
  { provide: Kernel, useClass: Kernel },
  { provide: ServerManager, useClass: ServerManager }
];