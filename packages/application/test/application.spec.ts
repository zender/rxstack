import 'reflect-metadata';
import {Application} from '../src/application';
import {MockService} from './mocks/mock.service';
import {Injector} from 'injection-js';
import {AppModule} from './mocks/app.module';
import {Configuration} from '@rxstack/configuration';
import {MockServer} from './mocks/mock.server';

describe('Application', () => {
  // Setup application
  process.env.NODE_ENV = 'test';
  Configuration.initialize(__dirname + '/environments');
  const app = new Application(AppModule);
  let injector: Injector;

  before(async () => {
    await app.start();
    injector = app.getInjector();
  });

  it('should create the injector', async () => {
    injector.should.not.be.undefined;
  });

  it('should start the servers', async () => {
    injector.get(MockServer).started.should.be.true;
  });

  it('should resolve injector aware services', async () => {
    injector.get(MockService).injector.should.be.equal(injector);
  });

  it('should resolve imported modules', async () => {
    injector.get(MockService).should.be.instanceOf(MockService);
    injector.get('mock.service2').should.be.instanceOf(MockService);
    injector.get(MockService).config.name.should.be.equal('test1 module name');
  });

  it('should register and dispatch bootstrap event', async () => {
    injector.get(MockService).modifiedByBootstrapEvent.should.be.true;
  });

  it('should stop the servers', async () => {
    app.stop();
    injector.get(MockServer).started.should.be.false;
  });
});
