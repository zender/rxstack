import {HttpDefinition, ResponseObject, WebSocketDefinition} from './interfaces';
import {Injectable, Injector} from 'injection-js';
import {Request} from './models/request';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {transformToException} from '@rxstack/exceptions';
import {KernelEvents} from './kernel-events';
import {RequestEvent} from './events/request-event';
import {ResponseEvent} from './events/response-event';
import {ExceptionEvent} from './events/exception-event';
import {Logger} from '../logger';
import {InjectorAwareInterface} from '../application';
import {HttpMetadata, httpMetadataStorage, WebSocketMetadata, webSocketMetadataStorage} from './metadata';

@Injectable()
export class Kernel implements InjectorAwareInterface {

  httpDefinitions: HttpDefinition[] = [];

  webSocketDefinitions: WebSocketDefinition[] = [];

  private injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  initialize(): void {
    httpMetadataStorage.all.forEach((metadata: HttpMetadata) => {
      this.registerHttpDefinition(metadata);
    });
    webSocketMetadataStorage.all.forEach((metadata: WebSocketMetadata) => {
      this.registerWebSocketDefinition(metadata);
    });
  }

  reset(): void {
    this.httpDefinitions = [];
    this.webSocketDefinitions = [];
  }

  private registerHttpDefinition(metadata: HttpMetadata): void {
    // controller instance
    const controller: Object = this.injector.get(metadata.target, false);
    if (!controller) {
      return;
    }

    const path = `${metadata.path}`.replace(new RegExp('/*$'), '');

    this.httpDefinitions.push({
      path: path,
      name: metadata.name,
      method: metadata.httpMethod,
      handler: async (request: Request): Promise<ResponseObject> => {
        request.method = metadata.httpMethod;
        request.path = path;
        request.routeName = metadata.name;
        request.controller = controller;
        return this.process(request, controller, metadata.propertyKey);
      }
    });

    this.injector.get(Logger).source(this.constructor.name)
      .debug(` registered http ${metadata.name}`);
  }

  private registerWebSocketDefinition(metadata: WebSocketMetadata): void {
    // controller instance
    const controller: Object = this.injector.get(metadata.target, false);
    if (!controller) {
      return;
    }

    this.webSocketDefinitions.push({
      name: metadata.name,
      ns: metadata.ns,
      handler: async (request: Request): Promise<ResponseObject> => {
        request.path = metadata.ns;
        request.routeName = metadata.name;
        request.controller = controller;
        return this.process(request, controller, metadata.propertyKey);
      }
    });

    this.injector.get(Logger).source(this.constructor.name)
      .debug(` registered websocket ${metadata.name}`);
  }

  private async process(request: Request, controller: Object, propertyKey: string): Promise<ResponseObject> {
    let response: ResponseObject;
    try {
      const requestEvent = new RequestEvent(request);
      await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_REQUEST, requestEvent);
      request = requestEvent.getRequest();

      if (requestEvent.hasResponse())
        return await this.handleResponse(requestEvent.getResponse(), request);
      // call controller
      response = await controller[propertyKey].call(controller, request);
      return await this.handleResponse(response, request);
    } catch (e) {
      let exception = transformToException(e);

      try {
        const exceptionEvent = new ExceptionEvent(exception, request);
        await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_EXCEPTION, exceptionEvent);
        exception = exceptionEvent.getException();
        if (exceptionEvent.hasResponse())
          return await this.handleResponse(exceptionEvent.getResponse(), request);
        throw exception;
      } catch (e) {
        throw transformToException(e);
      }
    }
  }

  private async handleResponse(response: ResponseObject, request: Request): Promise<ResponseObject> {
    try {
      const responseEvent = new ResponseEvent(request, response);
      await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_RESPONSE, responseEvent);
      return responseEvent.getResponse();
    } catch (e) {
      throw transformToException(e);
    }
  }
}