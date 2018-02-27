import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {Token} from '../src/models';
import {User} from '../src/models/user';
import {AuthenticationProviderManager} from '../src/authentication/authentication-provider-manager';
import {BadCredentialsException} from '../src/exceptions';

describe('Security:TokenAuthenticationProvider', () => {
  // Setup application
  const app = new Application(AppModule);
  let injector: Injector;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });


  it('should authenticate token', async () => {
    const token = new Token('generated-token');
    const provider = injector.get(AuthenticationProviderManager).getByName('token');
    const authToken = await provider.authenticate(token);
    authToken.isAuthenticated().should.be.true;
    authToken.getUser().should.be.instanceOf(User);
    authToken.hasRole('ADMIN').should.be.true;
  });

  it('should throw an exception if user identity field is not found', async () => {
    const token = new Token('no-username');
    const provider = injector.get(AuthenticationProviderManager).getByName('token');
    let exception: any;
    try {
      await provider.authenticate(token);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadCredentialsException);
  });

  it('should throw an exception if token is invalid', async () => {
    const token = new Token('invalid');
    const provider = injector.get(AuthenticationProviderManager).getByName('token');
    let exception: any;
    try {
      await provider.authenticate(token);
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(BadCredentialsException);
  });
});
