import {Provider} from 'injection-js';
import {Configuration} from '@rxstack/configuration';

export type ProviderDefinition = Provider | Promise<Provider>;

export interface Module {}

export interface ConfigurationFunction {
  (config: Configuration): void;
}