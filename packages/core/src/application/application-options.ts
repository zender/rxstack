import {LoggerConfiguration} from '../logger/logger-configuration';

export class ApplicationOptions {
  servers: string[] = [];
  logger: LoggerConfiguration;

  constructor(obj: any) {
    this.logger = new LoggerConfiguration(obj.logger);
    this.servers = obj['servers'];
  }
}