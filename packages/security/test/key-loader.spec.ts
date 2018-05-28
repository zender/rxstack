import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWitRsa} from './environments/environment.with-rsa';
import {KeyLoader} from '../src/services';
import {jwt_app_options} from './mocks/jwt-app-options';

describe('KeyLoaderWithRsa', () => {
  // Setup application
  const app = new Application(jwt_app_options(environmentWitRsa));
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
    (typeof key).should.be.equal('object');
  });

  it('should load private key', async () => {
    const key = await injector.get(KeyLoader).loadPrivateKey();
    (typeof key).should.be.equal('object');
  });
});
