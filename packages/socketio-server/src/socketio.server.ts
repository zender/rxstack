import * as http from 'http';
import {Request, ResponseObject, RouteDefinition, StreamableResponse} from '@rxstack/kernel';
import {
  AbstractServer, ServerConfigurationEvent, ServerManager, ServerEvents,
  SocketEvent
} from '@rxstack/server-commons';
import {ServiceRegistry} from '@rxstack/service-registry';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import Socket = SocketIO.Socket;
import * as socketIO from 'socket.io';
import {Exception} from '@rxstack/exceptions';
import {Injectable} from 'injection-js';
import {SocketioServerConfiguration} from './socketio-server-configuration';

@Injectable()
@ServiceRegistry(ServerManager.ns, SocketioServer.serverName)
export class SocketioServer extends AbstractServer {

  static serverName = 'server.socketio';

  protected async configure(routeDefinition: RouteDefinition[]): Promise<void> {
    const configuration = this.injector.get(SocketioServerConfiguration);
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    this.host = configuration.host;
    this.port = configuration.port;
    this.httpServer = http.createServer();
    this.engine = socketIO(this.httpServer);
    this.engine.sockets.setMaxListeners(configuration.maxListeners);

    await dispatcher.dispatch(
      ServerEvents.CONFIGURE,
      new ServerConfigurationEvent(this.engine, SocketioServer.serverName)
    );

    this.engine.sockets.on('connection', async (socket: Socket) => {
      this.setupSocket(socket, routeDefinition);
      await dispatcher.dispatch(
        ServerEvents.CONNECTED,
        new SocketEvent(socket, SocketioServer.serverName)
      );
      socket.on('disconnect', async (reason: any) => {
        await dispatcher.dispatch(
          ServerEvents.DISCONNECTED,
          new SocketEvent(socket, SocketioServer.serverName)
        );
      });
    });
  }

  private createRequest(routeDefinition: RouteDefinition, socket: Socket, args: any): Request {
    args = args || {};
    const request = new Request('SOCKET');
    request.path = routeDefinition.path;
    request.headers.fromObject(socket.request.headers);
    request.params.fromObject(args.params || {});
    request.files.fromObject({}); // todo - implement file upload
    request.body = args.body || null;
    request.connection = socket;

    return request;
  }

  private registerRoute(routeDefinition: RouteDefinition, socket: Socket): void {
    socket.on(routeDefinition.routeName, async (args: any, callback: Function) => {
      return routeDefinition.handler(this.createRequest(routeDefinition, socket, args))
        .then((response: ResponseObject) => this.responseHandler(response, callback))
        .catch((err: Exception) => this.errorHandler(err, callback));
    });
  }

  private responseHandler(response: ResponseObject, callback: Function): void {
    // todo - implement streams
    if (response instanceof StreamableResponse)
      throw new Exception('StreamableResponse is not supported.');

    callback.call(null, {
      'statusCode': response.statusCode,
      'content': response.content || null,
    });
  }

  private errorHandler(err: Exception, callback: Function) {
    const status = err['statusCode'] ?  err['statusCode'] : 500;
    err['statusCode'] = status;
    if (status >= 500)
      this.getLogger().error(err.message, err);
    else
      this.getLogger().debug(err.message, err);

    if (process.env.NODE_ENV === 'production' && status >= 500)
      callback.call(null, {message: 'Internal Server Error', statusCode: status});
    else
      callback.call(null, err);
  }

  private setupSocket(socket: Socket, routeDefinitions: RouteDefinition[]): void {
    routeDefinitions.forEach(
      (routeDefinition: RouteDefinition) => this.registerRoute(routeDefinition, socket)
    );
  }
}