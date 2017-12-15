import {Provider} from 'injection-js';
import {Configuration} from '@rxstack/configuration';

export const MODULE_KEY = '__module__';

export type ProviderDefinition = Provider | Promise<Provider>;

export interface ModuleInterface {}

export interface ModuleMetadata {
  imports?: ModuleInterface[];
  providers?: ProviderDefinition[];
  configuration?: ConfigurationFunction;
}

export interface ConfigurationFunction {
  (config: Configuration): void;
}