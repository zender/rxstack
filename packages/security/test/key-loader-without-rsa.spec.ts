import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWithoutRsa} from './environments/environment.without-rsa';
import {KeyLoader} from '../src/services';
import {AppJwtModule} from './mocks/app-jwt.module';

describe('KeyLoaderWithoutRsa', () => {
  // Setup application
  const app = new Application(AppJwtModule.configure(environmentWithoutRsa), environmentWithoutRsa);
  let injector: Injector = null;

  before(async() =>  {
    await app.start();
    injector = app.getInjector();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should load public key', async () => {
    const key = await injector.get(KeyLoader).loadPublicKey();
    key.should.be.equal('my_secret');
  });

  it('should load private key', async () => {
    const key = await injector.get(KeyLoader).loadPrivateKey();
    key.should.be.equal('my_secret');
  });
});
