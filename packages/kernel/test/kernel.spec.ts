import 'reflect-metadata';
import {KERNEL_PROVIDERS} from '../src/providers';
import {ReflectiveInjector} from 'injection-js';
import {Kernel} from '../src/kernel';
import {STUB_PROVIDERS} from './stubs/providers';
import {RouteDefinition} from '../src/interfaces';
import {Request} from '../src/models/request';
import {Response} from '../src/models/response';
import {Exception, InternalServerErrorException} from '@rxstack/exceptions';
import {AnnotatedController} from './stubs/annotated.controller';

const findRouteDefinition = function (data: RouteDefinition[], controllerName: string, methodName: string) {
  const def = data.find((routeDef: RouteDefinition) =>
    routeDef.controllerName === controllerName && routeDef.methodName === methodName);
  if (!def)
    throw new Error('Route definition not found.');
  return def;
};

describe('Kernel', () => {

  // Setup
  const resolvedProviders = ReflectiveInjector.resolve(KERNEL_PROVIDERS.concat(STUB_PROVIDERS));
  const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
  const kernel = injector.get(Kernel);
  kernel.setInjector(injector);
  kernel.initialize();

  it('should throw an exception if kernel is initialized again', async () => {
    let exception: Exception;
    try {
      kernel.initialize();
    } catch (e) {
      exception = e;
    }

    exception.should.be.instanceof(Exception);
    exception.message.should.be.equal('Kernel is already initialized.');
  });

  it('should call controller index action', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotatedController.name, 'indexAction');
    const request = new Request('HTTP');
    const response: Response = await def.handler(request);
    response.statusCode.should.be.equal(200);
    response.content.should.be.equal('AnnotatedController::indexAction');
  });


  it('should throw an exception', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotatedController.name, 'exceptionAction');
    const request = new Request('HTTP');
    let exception: Exception;

    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }

    exception.should.be.instanceof(Exception);
    exception.message.should.be.equal('Exception');
  });

  it('should stop after request event is dispatched', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotatedController.name, 'indexAction');
    const request = new Request('HTTP');
    request.params.set('type', 'test_request_event');
    const response: Response = await def.handler(request);
    response.content.should.be.equal('modified_by_request_event');
  });

  it('should stop after response event is dispatched', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotatedController.name, 'indexAction');
    const request = new Request('HTTP');
    request.params.set('type', 'test_response_event');
    let response: Response = await def.handler(request);
    response.content.should.be.equal('modified_by_response_event');
  });

  it('should stop after exception event is dispatched', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotatedController.name, 'exceptionAction');
    const request = new Request('HTTP');
    request.params.set('type', 'test_exception_event');
    const response: Response = await def.handler(request);
    response.content.should.be.equal('modified_by_exception_event');
  });


  it('should throw different exception than original one after exception event is dispatched', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotatedController.name, 'exceptionAction');
    const request = new Request('HTTP');
    request.params.set('type', 'test_exception_event_with_changed_exception');
    let exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceof(InternalServerErrorException);
  });

  it('should throw an exception after response event is dispatched', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotatedController.name, 'indexAction');
    const request = new Request('HTTP');
    request.params.set('type', 'test_response_event_with_exception');
    let exception: Exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceof(Exception);
    exception.message.should.be.equal('ExceptionInResponseEvent');
  });
});