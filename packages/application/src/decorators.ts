import 'reflect-metadata';
import {ConfigurationFunction, Module, ProviderDefinition} from './interfaces';

export const MODULE_KEY = '__module__';

export interface ModuleMetadata {
  imports?: Module[];
  providers?: ProviderDefinition[];
  configuration?: ConfigurationFunction;
}

export function Module(options: ModuleMetadata): ClassDecorator {
  return function (target: Function): void {
    Reflect.defineMetadata(MODULE_KEY, options, target);
  };
}
