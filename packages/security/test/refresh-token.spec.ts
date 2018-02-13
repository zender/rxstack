import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments');
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {REFRESH_TOKEN_MANAGER} from '../src/security.module';
import {RefreshTokenManagerInterface} from '../src/interfaces';


describe('Security:RefreshToken', () => {
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

  it('should create a token', async () => {
    const manager = injector.get<RefreshTokenManagerInterface>(REFRESH_TOKEN_MANAGER);
    const token = await manager.create('admin', {'key': 'value'});
    (typeof token).should.be.equal('string');
    let cnt = await manager.count();
    cnt.should.be.equal(1);
    const refreshed = await manager.refresh(token, 'admin');
    refreshed.should.be.equal('generated-token');
    await manager.disable(token, 'admin');
    cnt = await manager.count();
    cnt.should.be.equal(0);
  });
});
