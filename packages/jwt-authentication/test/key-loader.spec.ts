import 'reflect-metadata';
import {Application} from '@rxstack/application';
import {Injector} from 'injection-js';
import {AppModule} from './mocks/app.module';
import {environmentWitRsa} from './environments/environment.with-rsa';
import {KeyLoader} from '../src/services';

describe('KeyLoaderWithRsa', () => {
  AppModule.options = environmentWitRsa;
  // Setup application
  const app = new Application(AppModule.configure());
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
