import {metadataStorage} from './metadata-storage';
import {HttpMethod} from '../interfaces';

/**
 * Decorator is used to mark a class as a controller
 *
 * @param {string} path
 * @returns {ClassDecorator}
 * @constructor
 */
export function Controller(path: string): ClassDecorator {
  return function (target: Function): void {
    metadataStorage.addControllerMetadata({
      target: target,
      path: path
    });
  };
}

/**
 * Decorator is used to mark a method as a route
 *
 * @param {HttpMethod} httpMethod
 * @param {string} path
 * @param {string} name
 * @returns {MethodDecorator}
 * @constructor
 */
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
