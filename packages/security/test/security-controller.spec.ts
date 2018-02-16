import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {Kernel, Request, Response, RouteDefinition} from '@rxstack/kernel';
import {MethodNotAllowedException, NotFoundException, UnauthorizedException} from '@rxstack/exceptions';
import {EventEmitter} from 'events';
import {REFRESH_TOKEN_MANAGER} from '../src';
import {AnonymousToken, Token} from '../src/models';

const findRouteDefinition = function (data: RouteDefinition[], routeName: string) {
  const def = data.find((routeDef: RouteDefinition) =>
    routeDef.routeName === routeName);
  if (!def)
    throw new Error('Route definition not found.');
  return def;
};

describe('Security:Controller', () => {
  // Setup application
  const app = new Application(AppModule);
  let injector: Injector = null;
  let refreshToken: string;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should login', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'security_login');
    const request = new Request('HTTP');
    request.params.set('username', 'admin');
    request.params.set('password', 'admin');
    let response: Response = await def.handler(request);
    response.content.token.should.be.equal('generated-token');
    (typeof response.content.refreshToken).should.be.equal('string');
    refreshToken = response.content.refreshToken;
    request.token.isFullyAuthenticated().should.be.true;
  });

  it('should authenticate', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'security_authenticate');
    const request = new Request('SOCKET');
    request.connection = new EventEmitter();
    request.params.set('bearer', 'generated-token');
    let response: Response = await def.handler(request);
    response.statusCode.should.be.equal(204);
    request.connection['token'].should.be.instanceOf(Token);
    request.token.should.be.instanceOf(Token);
  });

  it('should not authenticate with invalid token', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'security_authenticate');
    const request = new Request('SOCKET');
    request.connection = new EventEmitter();
    request.params.set('bearer', 'invalid');
    let exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should refresh token', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'security_refresh_token');
    const request = new Request('HTTP');
    request.connection = new EventEmitter();
    request.params.set('refreshToken', refreshToken);
    let response: Response = await def.handler(request);
    response.content.token.should.be.equal('generated-token');
    request.token.isFullyAuthenticated().should.be.false;
  });

  it('should throw exception calling refresh token from socket', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'security_refresh_token');
    const request = new Request('SOCKET');
    request.connection = new EventEmitter();
    request.params.set('refreshToken', refreshToken);
    let exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(MethodNotAllowedException);
  });

  it('should throw exception calling refresh token with invalid token', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'security_refresh_token');
    const request = new Request('HTTP');
    request.connection = new EventEmitter();
    request.params.set('refreshToken', 'invalid');
    let exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(NotFoundException);
  });

  it('should logout', async () => {
    const kernel = injector.get(Kernel);
    const def = findRouteDefinition(kernel.getRouteDefinitions(), 'security_logout');
    const request = new Request('SOCKET');
    request.connection = new EventEmitter();
    request.params.set('refreshToken', refreshToken);
    let response: Response = await def.handler(request);
    response.statusCode.should.be.equal(204);
    const refreshTokenObj = await injector.get(REFRESH_TOKEN_MANAGER).get(refreshToken);
    refreshTokenObj.isValid().should.be.false;
    request.connection['token'].should.be.instanceOf(AnonymousToken);
  });

});
