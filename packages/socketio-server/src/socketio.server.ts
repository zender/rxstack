import * as http from 'http';
import {
  Request, ResponseObject, WebSocketDefinition, StreamableResponse,
  AbstractServer, ServerConfigurationEvent, ServerEvents, SocketEvent, Transport
} from '@rxstack/core';

import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import * as socketIO from 'socket.io';
import {Exception} from '@rxstack/exceptions';
import {Injectable} from 'injection-js';
import {SocketioServerConfiguration} from './socketio-server-configuration';
import {EventEmitter} from 'events';

@Injectable()
export class SocketioServer extends AbstractServer {

  static serverName = 'socketio';

  getName(): string {
    return SocketioServer.serverName;
  }

  getTransport(): Transport {
    return 'SOCKET';
  }

  protected async configure(definitions: WebSocketDefinition[]): Promise<void> {
    const configuration = this.injector.get(SocketioServerConfiguration);
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    this.host = configuration.host;
    this.port = configuration.port;
    this.httpServer = http.createServer();
    this.engine = socketIO(this.httpServer);
    this.engine.sockets.setMaxListeners(configuration.maxListeners);

    await dispatcher.dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this));

    this.getNamespaces(definitions).forEach((namespace) => {
      const filteredDefinitions = definitions.filter((item) => item.ns === namespace);
      const nsp = this.engine.of(namespace);
      nsp.on('connection', async (socket: EventEmitter) => {
        this.getLogger().log('debug', `Setting up namespace: ${namespace}`);
        this.setupSocket(socket, filteredDefinitions);
        await dispatcher.dispatch(
          ServerEvents.CONNECTED,
          new SocketEvent(socket, this, namespace)
        );
        socket.on('disconnect', async (reason: any) => {
          await dispatcher.dispatch(
            ServerEvents.DISCONNECTED,
            new SocketEvent(socket, this, namespace)
          );
        });
      });
    });
  }

  private getNamespaces(definitions: WebSocketDefinition[]): string[] {
    let ns: string[] = [];
    definitions.forEach((definition) => ns.push(definition.ns));
    return ns.reduce((x: string[], y: string) => x.includes(y) ? x : [...x, y], []);
  }

  private setupSocket(socket: EventEmitter, definitions: WebSocketDefinition[]): void {
    definitions.forEach(
      (definition) => this.registerRoute(definition, socket)
    );
  }

  private registerRoute(definition: WebSocketDefinition, socket: EventEmitter): void {
    socket.on(definition.name, async (args: any, callback: Function) => {
      return definition.handler(this.createRequest(definition, socket, args))
        .then((response: ResponseObject) => this.responseHandler(response, callback))
        .catch((err: Exception) => this.errorHandler(err, callback));
    });
  }

  private createRequest(definition: WebSocketDefinition, socket: EventEmitter, args: any): Request {
    args = args || {};
    const request = new Request('SOCKET');
    request.path = definition.ns;
    request.headers.fromObject(socket['request'].headers);
    request.params.fromObject(args.params || {});
    request.files.fromObject({}); // todo - implement file upload
    request.body = args.body || null;
    request.connection = socket;

    return request;
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
    if (status >= 500) {
      this.getLogger().error(err.message);
    } else {
      this.getLogger().debug(err.message);
    }

    if (process.env.NODE_ENV === 'production' && status >= 500) {
      callback.call(null, {message: 'Internal Server Error', statusCode: status});
    } else {
      callback.call(null, err);
    }
  }
}