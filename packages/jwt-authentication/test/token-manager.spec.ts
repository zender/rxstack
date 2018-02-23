import 'reflect-metadata';
import {Application} from '@rxstack/application';
import {Injector} from 'injection-js';
import {AppModule} from './mocks/app.module';
import {TokenManager} from '../src/services';
import {TOKEN_MANAGER} from '@rxstack/security';
import {JWTDecodeFailureException} from '../src/exceptions';
import {environmentWitRsa} from './environments/environment.with-rsa';

describe('TokenManager', () => {
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

  it('should encode and decode', async () => {
    const manager = injector.get(TOKEN_MANAGER);
    const encoded = await manager.encode({'key': 'value'});
    const decoded = await manager.decode(encoded);
    decoded.hasOwnProperty('key').should.be.true;
    decoded.hasOwnProperty('iss').should.be.true;
    decoded.hasOwnProperty('iat').should.be.true;
    decoded.hasOwnProperty('exp').should.be.true;
  });

  it('should throw an exception if token is invalid', async () => {
    const manager = injector.get(TOKEN_MANAGER);
    let exception: any;
    try {
      await manager.decode('invalid');
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(JWTDecodeFailureException);
  });
});
