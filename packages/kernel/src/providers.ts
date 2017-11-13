import {AsyncEventDispatcher, asyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Kernel} from './kernel';
import {ConsoleLogger, Logger} from '@rxstack/logger';
import {Provider} from 'injection-js';

export const KERNEL_PROVIDERS: Provider[] = [
  { provide: Kernel, useClass: Kernel },
  { provide: AsyncEventDispatcher, useValue: asyncEventDispatcher },
  { provide: Logger, useClass: ConsoleLogger },
];
