import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {Application, Kernel, Request, Response} from '@rxstack/core';
import { NotFoundException} from '@rxstack/exceptions';
import {EventEmitter} from 'events';
import {REFRESH_TOKEN_MANAGER} from '../src';
import {environment} from './environments/environment';
import {findHttpDefinition} from './helpers/kernel-definition-finder';

describe('Security:HttpController', () => {
  // Setup application
  const app = new Application(AppModule, environment);
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
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_login');
    const request = new Request('HTTP');
    request.params.set('username', 'admin');
    request.params.set('password', 'admin');
    let response: Response = await def.handler(request);
    response.content.token.should.be.equal('generated-token');
    (typeof response.content.refreshToken).should.be.equal('string');
    refreshToken = response.content.refreshToken;
    request.token.isFullyAuthenticated().should.be.true;
  });

  it('should refresh token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_refresh_token');
    const request = new Request('HTTP');
    request.connection = new EventEmitter();
    request.params.set('refreshToken', refreshToken);
    let response: Response = await def.handler(request);
    response.content.token.should.be.equal('generated-token');
    request.token.isFullyAuthenticated().should.be.false;
  });

  it('should throw exception calling refresh token with invalid token', async () => {
    const kernel = injector.get(Kernel);
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_refresh_token');
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
    const def = findHttpDefinition(kernel.httpDefinitions, 'security_logout');
    const request = new Request('HTTP');
    request.params.set('refreshToken', refreshToken);
    let response: Response = await def.handler(request);
    response.statusCode.should.be.equal(204);
    const refreshTokenObj = await injector.get(REFRESH_TOKEN_MANAGER).get(refreshToken);
    refreshTokenObj.isValid().should.be.false;
  });
});
