import {Injector} from 'injection-js';
import Socket = SocketIO.Socket;

export function socketMiddleware(injector: Injector) {
  return (socket: Socket, next: Function): void => {
    socket['token'] = 'user token';
    next();
  };
}
