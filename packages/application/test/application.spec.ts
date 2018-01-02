import 'reflect-metadata';
import {Application} from '../src/application';
import {MockService} from './mocks/mock.service';
import {Injector} from 'injection-js';
import {AppModule} from './mocks/app.module';
import {MOCK_SERVICE_1} from './mocks/test1.module';
import {MOCK_SERVICE_2} from './mocks/test2.module';
import {ServerManager} from '@rxstack/server-commons';

describe('Application', () => {
  // Setup application
  const app = new Application(AppModule);
  let injector: Injector;

  before(async () => {
    injector = await app.start();
  });

  it('should create the injector', async () => {
    injector.should.not.be.undefined;
  });

  it('should start the servers', async () => {
    injector.get(ServerManager).servers.forEach((server) => {
      server['started'].should.be.true;
    });
  });

  it('should set injector aware services', async () => {
    injector.get(MockService).injector.should.be.equal(injector);
  });

  it('should register imported module providers', async () => {
    injector.get(MOCK_SERVICE_1).should.be.instanceOf(MockService);
    injector.get(MOCK_SERVICE_2).should.be.instanceOf(MockService);
  });

  it('should dispatch bootstrap event', async () => {
    injector.get(MockService).modifiedByBootstrapEvent.should.be.true;
  });

  it('should stop the servers', async () => {
    app.stop();
    injector.get(ServerManager).servers.forEach((server) => {
      server['started'].should.be.false;
    });
  });
});
