import {MethodDefinition, RouteDefinition} from './interfaces';
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

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  initialize(): void {
    this.routeDefinitions = [];
    metadataStorage.getControllerMetadataCollection().forEach((metadata: ControllerMetadata) => {
      this.registerDefinition(metadata);
    });
  }

  getRouteDefinitions(): RouteDefinition[] {
    return this.routeDefinitions;
  }

  private registerDefinition(metadata: ControllerMetadata): void {
    const controller: Object = this.injector.get(metadata.target);

    metadata.methodDefinitions.forEach((methodDefinition: MethodDefinition, methodName: string) => {
      let path = `${metadata.options.routeBase}${methodDefinition.route}`;

      this.routeDefinitions.push({
        controllerName: controller.constructor.name,
        methodName: methodName,
        method: methodDefinition.method,
        basePath: metadata.options.routeBase,
        path: path,
        handler: async (request: Request): Promise<Response> => {
          request.method = methodDefinition.method;
          request.basePath = metadata.options.routeBase;
          request.path = path;
          request.methodName = methodName;
          request.controller = controller;

          let response: Response;

          try {
            const requestEvent = new RequestEvent(request);
            await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_REQUEST, requestEvent);
            request = requestEvent.getRequest();

            if (requestEvent.hasResponse()) {
              return await this.handleResponse(requestEvent.getResponse(), request);
            }

            // call controller
            response = await controller[methodName].bind(controller).call(this, request);
            return await this.handleResponse(response, request);
          } catch (e) {
            let exception = transformToException(e);

            try {
              let exceptionEvent = new ExceptionEvent(exception, request);
              await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_EXCEPTION, exceptionEvent);
              exception = exceptionEvent.getException();

              if (exceptionEvent.hasResponse()) {
                return await this.handleResponse(exceptionEvent.getResponse(), request);
              }

              throw exception;

            } catch (e) {
              exception = transformToException(e);
              throw exception;
            }
          }
        }
      });

      this.injector.get(Logger).source(this.constructor.name)
        .debug(`registered ${methodDefinition.method} ${metadata.options.routeBase}${methodDefinition.route} to ${controller.constructor.name}@${methodName}`);
    });
  }

  private async handleResponse(response: Response, request: Request): Promise<Response> {
    try {
      const responseEvent = new ResponseEvent(request, response);
      await this.injector.get(AsyncEventDispatcher).dispatch(KernelEvents.KERNEL_RESPONSE, responseEvent);
      return Promise.resolve(responseEvent.getResponse());
    } catch (e) {
      const exception = transformToException(e);
      throw exception;
    }
  }
}