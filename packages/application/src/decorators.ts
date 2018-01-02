import 'reflect-metadata';
import {MODULE_KEY , ModuleMetadata, } from './interfaces';

export function Module(options: ModuleMetadata): ClassDecorator {
  return function (target: Function): void {
    Reflect.defineMetadata(MODULE_KEY, options, target);
  };
}
