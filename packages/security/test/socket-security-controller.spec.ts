import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import {UnauthorizedException} from '@rxstack/exceptions';
import {EventEmitter} from 'events';
import {REFRESH_TOKEN_MANAGER} from '../src';
import {AnonymousToken, Token, UsernameAndPasswordToken} from '../src/models';
import {environment} from './environments/environment';
import {findWebSocketDefinition} from './helpers/kernel-definition-finder';

describe('Security:SocketController', () => {
  // Setup application
  const app = new Application(AppModule, environment);
  let injector: Injector = null;
  let refreshToken: string;
  let connection = new EventEmitter();

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should login', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_login');
    const request = new Request('SOCKET');
    request.connection = connection;
    request.params.set('username', 'admin');
    request.params.set('password', 'admin');
    let response: Response = await def.handler(request);
    refreshToken = response.content.refreshToken;
    request.connection['token'].should.be.instanceOf(UsernameAndPasswordToken);
    request.token.should.be.instanceOf(UsernameAndPasswordToken);
    request.token.isFullyAuthenticated().should.be.true;
  });

  it('should authenticate', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_authenticate');
    const request = new Request('SOCKET');
    request.connection = connection;
    request.params.set('bearer', 'generated-token');
    let response: Response = await def.handler(request);
    response.statusCode.should.be.equal(204);
    request.connection['token'].should.be.instanceOf(Token);
    request.token.should.be.instanceOf(Token);
  });

  it('should not authenticate with invalid token', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_authenticate');
    const request = new Request('SOCKET');
    request.connection = connection;
    request.params.set('bearer', 'invalid');
    let exception;
    try {
      await def.handler(request);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(UnauthorizedException);
  });

  it('should wait for the token timeout', (done) => {
    (typeof connection['tokenTimeout'] === 'object').should.be.true;
    setTimeout(() => {
      connection['token']['fullyAuthenticated'].should.be.false;
      done();
    }, 1000);
  });

  it('should logout', async () => {
    const kernel = injector.get(Kernel);
    const def = findWebSocketDefinition(kernel.webSocketDefinitions, 'security_logout');
    const request = new Request('SOCKET');
    request.connection = connection;
    request.params.set('refreshToken', refreshToken);
    let response: Response = await def.handler(request);
    response.statusCode.should.be.equal(204);
    const refreshTokenObj = await injector.get(REFRESH_TOKEN_MANAGER).get(refreshToken);
    refreshTokenObj.isValid().should.be.false;
    request.connection['token'].should.be.instanceOf(AnonymousToken);
  });
});
