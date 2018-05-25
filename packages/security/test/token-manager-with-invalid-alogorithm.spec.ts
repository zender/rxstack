import 'reflect-metadata';
import {Application} from '@rxstack/core';
import {Injector} from 'injection-js';
import {environmentWithInvalidAlgorithm} from './environments/environment.with-invalid-algowithm';
import {JWTEncodeFailureException} from '../src/exceptions';
import {AppJwtModule} from './mocks/app-jwt.module';
import {TOKEN_MANAGER} from '../src';

describe('TokenManagerWithInvalidAlgorithm', () => {
  // Setup application
  const app = new Application(AppJwtModule.configure(environmentWithInvalidAlgorithm), environmentWithInvalidAlgorithm);
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
    let exception: any;
    try {
      await manager.encode({});
    } catch (e) {
      exception = e;
    }
    exception.should.be.instanceOf(JWTEncodeFailureException);
  });
});
