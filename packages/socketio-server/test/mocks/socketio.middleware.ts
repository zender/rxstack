import {Injector} from 'injection-js';

export function socketMiddleware(injector: Injector) {
  return (socket: any, next: any): void => {
    socket['token'] = 'user token';
    next();
  };
}
