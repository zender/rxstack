import 'reflect-metadata';
import {Application} from '@rxstack/application';
import {Injector} from 'injection-js';
import {AppModule} from './mocks/app.module';
import {TOKEN_MANAGER} from '@rxstack/security';
import {environmentWithInvalidAlgorithm} from './environments/environment.with-invalid-algowithm';
import {JWTEncodeFailureException} from '../src/exceptions';

describe('TokenManagerWithInvalidAlgorithm', () => {
  AppModule.options = environmentWithInvalidAlgorithm;
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
