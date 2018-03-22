import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {AppModule} from './mocks/app.module';
import {environmentWithoutRsa} from './environments/environment.without-rsa';
import {KeyLoader} from '../src/services';

describe('KeyLoaderWithoutRsa', () => {
  // Setup application
  const app = new Application(AppModule.configure(environmentWithoutRsa), environmentWithoutRsa);
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
