import {LoggerHandler} from './interfaces';

export class LoggerConfiguration {
  handlers: LoggerHandler[];

  constructor(obj: Object) {
    this.handlers = Array.isArray(obj['handlers']) ? obj['handlers'] : [];
  }
}