import {HttpMethod} from '../interfaces';
import {httpMetadataStorage, webSocketMetadataStorage} from './metadata-storage';

export function Http<T>(httpMethod: HttpMethod, path: string, name: string): MethodDecorator {
  return function (target: Function, propertyKey: string): void {
    httpMetadataStorage.add({
      'target': target.constructor,
      'name': name,
      'path': path,
      'httpMethod': httpMethod,
      'propertyKey': propertyKey,
    });
  };
}

export function WebSocket<T>(eventName: string, ns = '/'): MethodDecorator {
  return function (target: Function, propertyKey: string): void {
    webSocketMetadataStorage.add({
      'target': target.constructor,
      'name': eventName,
      'propertyKey': propertyKey,
      'ns': ns
    });
  };
}
