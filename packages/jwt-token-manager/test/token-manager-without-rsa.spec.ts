import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {TOKEN_MANAGER} from '@rxstack/security';
import {AppModule} from './mocks/app.module';
import {environmentWithoutRsa} from './environments/environment.without-rsa';

describe('TokenManagerWithRsa', () => {
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

  it('should encode', async () => {
    const manager = injector.get(TOKEN_MANAGER);
    const encoded = await manager.encode({'key': 'value'});
    const decoded = await manager.decode(encoded);
    decoded.hasOwnProperty('key').should.be.true;
    decoded.hasOwnProperty('iss').should.be.true;
    decoded.hasOwnProperty('iat').should.be.true;
    decoded.hasOwnProperty('exp').should.be.true;
  });
});
