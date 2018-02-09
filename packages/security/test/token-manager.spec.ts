import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {TOKEN_MANAGER} from '../src/security.module';

describe('Security:TokenExtractors', () => {
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
    let a = injector.get(TOKEN_MANAGER);
    console.log(await a.encode({'sasa': 'asasas'}));
    console.log(await a.decode('token'));
  });
});
