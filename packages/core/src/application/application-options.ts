import {LoggerConfiguration} from '../logger/logger-configuration';
import {ModuleType, ProviderDefinition} from './interfaces';

export class ApplicationOptions {
  imports?: ModuleType[];
  providers?: ProviderDefinition[];
  servers: string[] = [];
  logger: LoggerConfiguration;

  constructor(obj: any) {
    this.imports = obj['imports'] ? obj['imports'] : [];
    this.providers = obj['providers'] ? obj['providers'] : [];
    this.logger = new LoggerConfiguration(obj.logger);
    this.servers = obj['servers'];
  }
}