import {RouteDefinition} from './interfaces';
import {Injectable, Injector} from 'injection-js';
import {ControllerMetadata} from './metadata/metadata';
import {metadataStorage} from './metadata/metadata-storage';
import {Response} from './models/response';
import {Request} from './models/request';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Exception, transformToException} from '@rxstack/exceptions';
import {Logger} from '@rxstack/logger';
import {KernelEvents} from './kernel-events';
import {RequestEvent} from './events/request-event';
import {ResponseEvent} from './events/response-event';
import {ExceptionEvent} from './events/exception-event';

@Injectable()
export class Kernel {
  private injector: Injector;
  private routeDefinitions: RouteDefinition[] = [];
  private initialized = false;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  initialize(): void {
    if (this.initialized)
      throw new Exception('Kernel is already initialized.');
    metadataStorage.getControllerMetadataCollection().forEach((metadata: ControllerMetadata) => {
      this.registerDefinition(metadata);
    });
    this.initialized = true;
  }

  getRouteDefinitions(): RouteDefinition[] {
    return this.routeDefinitions;
  }

  private registerDefinition(controllerMetadata: ControllerMetadata): void {
    const controller: Object = this.injector.get(controllerMetadata.target);

    metadataStorage.getRouteMetadataCollection(controllerMetadata.target).forEach((routeMetadata) => {
      let path = `${controllerMetadata.path}${routeMetadata.path}`.replace(new RegExp('/*$'), '');

      this.routeDefinitions.push({
        path: path,
        routeName: routeMetadata.name,
        method: routeMetadata.httpMethod,
        handler: async (request: Request): Promise<Response> => {
          request.method = routeMetadata.httpMethod;
          request.basePath = controllerMetadata.path;
          request.path = path;
          request.methodName = routeMetadata.name;
          request.controller = controller;
          let response: Response;
          try {
            const requestEvent = new RequestEvent(request);
            await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_REQUEST, requestEvent);
            request = requestEvent.getRequest();

            if (requestEvent.hasResponse())
              return await this.handleResponse(requestEvent.getResponse(), request);
            // call controller
            response = await controller[routeMetadata.propertyKey].bind(controller).call(this, request);
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
              exception = transformToException(e);
              throw exception;
            }
          }
        }
      });

      this.injector.get(Logger).source(this.constructor.name)
        .debug(`registered ${routeMetadata.httpMethod} ${path} to ${controller.constructor.name}::${routeMetadata.propertyKey}`);
    });
  }

  private async handleResponse(response: Response, request: Request): Promise<Response> {
    try {
      const responseEvent = new ResponseEvent(request, response);
      await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_RESPONSE, responseEvent);
      return responseEvent.getResponse();
    } catch (e) {
      const exception = transformToException(e);
      throw exception;
    }
  }
}