import {metadataStorage} from './metadata-storage';
import {HttpMethod} from '../interfaces';

export function Controller(path: string): ClassDecorator {
  return function (target: Function): void {
    metadataStorage.addControllerMetadata({
      target: target,
      path: path
    });
  };
}

export function Route<T>(httpMethod: HttpMethod, path: string, name: string): MethodDecorator {
  return function (target: Function, propertyKey: string): void {
    metadataStorage.addRouteMetadata({
      'target': target.constructor,
      'name': name,
      'path': path,
      'httpMethod': httpMethod,
      'propertyKey': propertyKey,
    });
  };
}
