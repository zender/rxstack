import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {Kernel, Request, Response, RouteDefinition} from '@rxstack/kernel';
import {UnauthorizedException} from '@rxstack/exceptions';

const findRouteDefinition = function (data: RouteDefinition[], routeName: string) {
  const def = data.find((routeDef: RouteDefinition) =>
    routeDef.routeName === routeName);
  if (!def)
    throw new Error('Route definition not found.');
  return def;
};

describe('Security:Listeners', () => {
  // Setup application
  const app = new Application(AppModule);
  let injector: Injector = null;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should set token in request and authenticate', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'test_index');
    const request = new Request('HTTP');
    request.params.set('bearer', 'generated-token');
    let response: Response = await def.handler(request);
    response.content.should.be.equal('admin');
  });

  it('should throw UnauthorizedException if user role does not match', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'test_index');
    const request = new Request('HTTP');
    let exception: UnauthorizedException = null;
    try {
      let response: Response = await def.handler(request);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        exception = e;
      }
    }
    (exception !== null).should.be.true;
  });

  it('should throw UnauthorizedException if token is not valid', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'test_index');
    const request = new Request('HTTP');
    request.params.set('bearer', 'invalid');
    let exception: UnauthorizedException = null;
    try {
      await def.handler(request);
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        exception = e;
      }
    }
    (exception !== null).should.be.true;
  });

  it('should get anonymous token', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'test_anon');
    const request = new Request('HTTP');
    let response: Response = await def.handler(request);
    response.content.username.should.be.equal('anon');
  });
});
