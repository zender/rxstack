import 'reflect-metadata';
import {KERNEL_PROVIDERS} from '../src/providers';
import {ReflectiveInjector} from 'injection-js';
import {Kernel} from '../src/kernel';
import {STUB_PROVIDERS} from './stubs/providers';
import {RouteDefinition} from '../src/interfaces';
import {Request} from '../src/models/request';
import {Response} from '../src/models/response';
import {AnnotationController} from './stubs/annotation.controller';
import {Exception} from '@rxstack/exceptions';

const findRouteDefinition = function (data: RouteDefinition[], controllerName: string, methodName: string) {
  const def = data.find((routeDef: RouteDefinition) =>
    routeDef.controllerName === controllerName && routeDef.methodName === methodName);

  if (!def) {
    throw new Error('Route definition not found.');
  }
  return def;
};

describe('Kernel', () => {

  // Setup
  const resolvedProviders = ReflectiveInjector.resolve(KERNEL_PROVIDERS.concat(STUB_PROVIDERS));
  const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
  const kernel = injector.get(Kernel);
  kernel.setInjector(injector);
  kernel.initialize();

  beforeEach(async () => {


  });

  it('should call controller action method', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotationController.name, 'getAction');
    const request = new Request('HTTP');
    request.params.set('test_type', 'action_method');
    const response: Response = await def.handler(request);
    response.statusCode.should.be.equal(200);
    JSON.stringify(response.content).should.be.equal(JSON.stringify({ data: 'AnnotationController.getAction' }));
  });


  it('should throw an exception', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotationController.name, 'exceptionAction');
    const request = new Request('HTTP');
    let response: Response;
    let exception: Exception;

    try {
      response = await def.handler(request);
    } catch (e) {
      exception = e;
    }

    exception.should.be.instanceof(Exception);
    exception.name.should.be.equal('Exception');
  });

  it('should stops after request event', async () => {
    const def = findRouteDefinition(kernel.getRouteDefinitions(), AnnotationController.name, 'getAction');
    const request = new Request('HTTP');
    request.params.set('type', 'test_request_event');
    let response: Response = await def.handler(request);
    response.content.should.be.equal('modified_by_request_event');
  });
});