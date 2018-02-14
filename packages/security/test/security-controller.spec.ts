import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {Kernel, Request, Response, RouteDefinition} from '@rxstack/kernel';
import {UnauthorizedException} from '@rxstack/exceptions';
import {EventEmitter} from 'events';
import {Token} from '../src/models/token';
import {UsernameAndPasswordToken} from '../src/models/username-and-password.token';

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
    const request = new Request('SOCKET');
    request.connection = new EventEmitter();
    request.params.set('username', 'admin');
    request.params.set('password', 'admin');
    let response: Response = await def.handler(request);
    response.content.token.should.be.equal('generated-token');
    (typeof response.content.refreshToken).should.be.equal('string');
    request.connection['token'].should.be.instanceOf(UsernameAndPasswordToken);
    refreshToken = response.content.refreshToken;
  });
});
