import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {AuthenticationProviderManager} from '../src/authentication/authentication-provider-manager';
import {UsernameAndPasswordToken} from '../src/models/username-and-password.token';
import {User} from '../src/models/user';
import {BadCredentialsException, ProviderNotFoundException} from '../src/exceptions/index';
import {TestToken} from './mocks/test-token';
import {TestSupportedToken} from './mocks/test-supported-token';
import {TestAuthenticationProviderException} from './mocks/test.authentication-provider';
import {AuthListener} from './mocks/auth.listener';

describe('Security:AuthenticationProviderManager', () => {
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

  it('should get provider by name', async () => {
    const provider = injector.get(AuthenticationProviderManager).getByName('user-password');
    provider.getProviderName().should.be.equal('user-password');
  });

  it('should authenticate token', async () => {
    const token = new UsernameAndPasswordToken('admin', 'admin');
    const manager = injector.get(AuthenticationProviderManager);
    const authToken = await manager.authenticate(token);
    authToken.isAuthenticated().should.be.true;
    authToken.getUser().should.be.instanceOf(User);
    authToken.hasRole('ADMIN').should.be.true;
    injector.get(AuthListener).successCalled.should.be.true;
  });

  it('should throw an exception is user pass is invalid', async () => {
    const token = new UsernameAndPasswordToken('admin', 'invalid');
    const manager = injector.get(AuthenticationProviderManager);
    let exception = null;
    try {
      await manager.authenticate(token);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadCredentialsException);
    injector.get(AuthListener).failureCalled.should.be.true;
  });

  it('should throw an exception if provider is not found', async () => {
    const token = new TestToken('test');
    const manager = injector.get(AuthenticationProviderManager);
    let exception = null;
    try {
      await manager.authenticate(token);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(ProviderNotFoundException);
  });

  it('should throw an exception if provider exception is not caught', async () => {
    const token = new TestSupportedToken();
    const manager = injector.get(AuthenticationProviderManager);
    let exception = null;
    try {
      await manager.authenticate(token);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(TestAuthenticationProviderException);
  });
});
