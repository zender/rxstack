import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {UserProviderManager} from '../src/user-providers/user-provider-manager';
import {UserNotFoundException} from '../src/exceptions/index';

describe('Security:UserProvider', () => {
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
    const provider = injector.get(UserProviderManager).getProviderByName('in-memory');
    provider.getUserProviderName().should.be.equal('in-memory');
  });

  it('should load the admin', async () => {
    const user = await injector.get(UserProviderManager).loadUserByUsername('admin');
    user.username.should.be.equal('admin');
  });

  it('should not load the admin', async () => {
    try {
      await injector.get(UserProviderManager).loadUserByUsername('none');
      throw new Error('User found');
    } catch (e) {
      e.should.be.instanceOf(UserNotFoundException);
    }
  });
});
