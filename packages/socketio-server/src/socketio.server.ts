import * as http from 'http';
import {Request, ResponseObject, RouteDefinition, StreamableResponse} from '@rxstack/kernel';
import {AbstractServer, ServerConfigurationEvent, ServerManager, ServerEvents} from '@rxstack/server-commons';
import {ServiceRegistry} from '@rxstack/service-registry';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Configuration} from '@rxstack/configuration';
import {Logger} from '@rxstack/logger';
import Server = SocketIO.Server;
import Socket = SocketIO.Socket;
import * as socketIO from 'socket.io';
import {Exception} from '@rxstack/exceptions';

@ServiceRegistry(ServerManager.ns, 'server.socketio')
export class SocketIOServer extends AbstractServer {

  protected app: Server;

  getEngine(): any {
    return this.app;
  }

  async startEngine(): Promise<void> {
    this.getHttpServer()
      .listen(this.port, this.host, () => this.getLogger().debug(`Starting ${this.getHost()}`));
  }

  async stopEngine(): Promise<void> {
    this.getHttpServer().close(() => this.getLogger().debug(`Stopping ${this.getHost()}`));
  }

  protected getLogger(): Logger {
    return this.getInjector().get(Logger).source(this.constructor.name);
  }

  protected async configure(routeDefinition: RouteDefinition[]): Promise<void> {
    const configuration = this.injector.get(Configuration);
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    this.host = configuration.get('socketio_server.host');
    this.port = configuration.get('socketio_server.port');
    const maxListeners = configuration.get('socketio_server.maxListeners');

    this.httpServer = http.createServer();
    this.app = socketIO(this.httpServer);
    this.app.sockets.setMaxListeners(maxListeners);

    await dispatcher.dispatch(ServerEvents.PRE_CONFIGURE, new ServerConfigurationEvent(this));

    this.app.sockets.on('connection', (socket: any) => {
      this.setupSocket(socket, routeDefinition);
    });

    this.app.sockets.on('connection', async (socket: any) => {
      await dispatcher.dispatch(ServerEvents.CONNECTED, new ServerConfigurationEvent(this));
      socket.on('disconnect', async (reason: any) => {
        await dispatcher.dispatch(ServerEvents.DISCONNECTED, new ServerConfigurationEvent(this));
      });
    });

    await dispatcher.dispatch(ServerEvents.POST_CONFIGURE, new ServerConfigurationEvent(this));
  }

  private registerRoute(routeDefinition: RouteDefinition, socket: Socket): void {
    socket.on(routeDefinition.routeName, async (args: any, callback: Function) => {
      const request = new Request('SOCKET');
      args = args || {};
      request.path = routeDefinition.path;
      request.headers.fromObject(socket.request.headers);
      request.query.fromObject(args.query || {});
      request.params.fromObject(args.params || {});
      request.files.fromObject({});
      request.body = args.body || null;
      request.token = socket['token'] ? socket['token'] : null;

      return routeDefinition.handler(request)
        .then((response: ResponseObject) => {
          // todo - implement streams
          if (response instanceof StreamableResponse)
            throw new Exception('StreamableResponse is not supported.');

          this.guessContentType(response);

          callback.call(null, {
            'statusCode': response.statusCode,
            'content': response.content || null,
            'headers': response.headers.toObject()
          });
        })
        .catch((err: Exception) => {
          err['statusCode'] ? null : err['statusCode'] = 500;
          const status = err['statusCode'];

          if (process.env.NODE_ENV === 'production' && status >= 500)
            callback.call(null, {message: 'Internal Server Error', statusCode: status});
          else
            callback.call(null, err);

          this.log(status, err);
        });
    });
  }

  private setupSocket(socket: any, routeDefinitions: RouteDefinition[]): void {
    routeDefinitions.forEach(
      (routeDefinition: RouteDefinition) => this.registerRoute(routeDefinition, socket)
    );
  }

  private guessContentType(response: ResponseObject): void {
    if (response.headers.has('content-type')) {
      return;
    }

    const type = typeof response.content;
    switch (type) {
      case 'object':
        response.headers.set('content-type', 'application/json');
        break;
      case 'string':
        response.headers.set('content-type', 'text/plain');
        break;
    }
  }

  private log(status: number, content: any): void {
    if (status >= 500) {
      this.getLogger().error(content);
    } else {
      this.getLogger().info(content);
    }
  }
}