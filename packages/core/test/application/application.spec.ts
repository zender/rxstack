import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/../environments', 'application_environment');
import {Application} from '../../src/application';
import {Injector} from 'injection-js';
import {AppModule} from './mocks/app.module';
import {application_environment} from '../environments/application_environment';
import {MockServer} from './mocks/mock.server';
import {MockService} from './mocks/mock.service';
import {MockService2} from './mocks/mock.service2';

describe('Application', () => {
  // Setup application
  const app = new Application(AppModule, application_environment);
  let injector: Injector;

  before(async () => {
    await app.start();
    injector = app.getInjector();
  });

  after(async () => {
    await app.stop();
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
    injector.get(MockService2).should.be.instanceOf(MockService2);
  });

  it('should register and dispatch bootstrap event', async () => {
    injector.get(MockService).modifiedByBootstrapEvent.should.be.true;
  });

  it('should stop the servers', async () => {
    app.stop();
    injector.get(MockServer).started.should.be.false;
  });
});
