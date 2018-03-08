import {LoggerConfiguration} from '../logger/logger-configuration';

export class ApplicationOptions {
  logger: LoggerConfiguration;
  skipServers: boolean;

  constructor(obj: any) {
    this.logger = new LoggerConfiguration(obj.logger);
    this.skipServers = obj.skipServers;
  }
}