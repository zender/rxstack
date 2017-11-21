import {metadataStorage} from './metadata-storage';
import {HttpMethod} from '../interfaces';
import {ControllerOptions} from './controller-options';

export function Controller(options: ControllerOptions): ClassDecorator {
  return function (target: Function): void {
    metadataStorage.addControllerMetadata(target, options);
  };
}

export function Route<T>(method: HttpMethod, route: string): MethodDecorator {
  return function (target: Function, propertyKey: string): void {
    metadataStorage.addMethodDefinition(target.constructor, propertyKey, {
      method, route
    });
  };
}
