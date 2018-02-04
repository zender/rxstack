import {LoggerHandler} from '@rxstack/logger';

export class ApplicationConfiguration {
  logger: {
    handlers: LoggerHandler[];
  }

  constructor(obj?: Object) {
    if (obj && Array.isArray(obj['handlers'])) {
      this.logger.handlers = obj['handlers'];
    }
    this.logger.handlers = obj && Array.isArray(obj['handlers']) ? obj && obj['handlers'] : [];
  }
}