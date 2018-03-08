import {LoggerConfiguration} from '../logger/logger-configuration';

export class ApplicationOptions {
  logger: LoggerConfiguration;

  constructor(obj?: any) {
    this.logger = new LoggerConfiguration(obj.logger);
  }
}