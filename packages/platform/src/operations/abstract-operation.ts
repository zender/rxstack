import {HttpMethod, InjectorAwareInterface, Request, Response} from '@rxstack/core';
import {Injector} from 'injection-js';
import {ApiOperationMetadata} from '../metadata/api-operation.metadata';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ApiOperationCallable} from '../interfaces';
import {ApiOperationEvent} from '../events';

export abstract class AbstractOperation implements InjectorAwareInterface {

  metadata: ApiOperationMetadata;

  protected injector: Injector;

  setInjector(injector: Injector): void {
    this.injector = injector;
  }

  onInit(): void { }

  protected getDispatcher(): AsyncEventDispatcher {
    return this.injector.get(AsyncEventDispatcher);
  }

  protected async dispatch(name: string, event: ApiOperationEvent): Promise<void> {
    await this.getDispatcher().dispatch(this.metadata.name + '.' + name, event);
  }

  protected registerOperationCallables(name: string, callables?: ApiOperationCallable[]): void {
    if (callables) {
      callables.forEach((callable): void => {
        this.getDispatcher().addListener(this.metadata.name + '.' + name, callable);
      });
    }
  }

  abstract execute(request: Request): Promise<Response>;

  abstract getSupportedHttpMethod(): HttpMethod;
}

