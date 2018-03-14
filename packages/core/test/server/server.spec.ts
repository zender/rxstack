import 'reflect-metadata';
import {Application} from '../../src/application';
import {application_environment} from '../environments/application_environment';
import {Injector} from 'injection-js';
import {NoopHttpServer, ServerEvents, ServerManager, SocketEvent} from '../../src/server';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {EventEmitter} from 'events';
import {ServerModule} from './fixtures/server.module';
import {SocketListener} from './fixtures/socket-listener';

describe('Server', () => {
  // Setup application
  const app = new Application(ServerModule, application_environment);
  let injector: Injector;
  let manager: ServerManager;

  before(async () => {
    await app.start();
    injector = app.getInjector();
    manager = injector.get(ServerManager);
  });

  after(async () => {
    await app.stop();
  });

  it('should get server by name', async () => {
    const server = manager.getByName('noop-http');
    server.should.be.instanceOf(NoopHttpServer);
  });

  it('should get http server', async () => {
    const server = manager.getByName('noop-http');
    (typeof server.getHttpServer() !== 'undefined').should.be.true;
  });

  it('should get engine', async () => {
    const server = manager.getByName('noop-http');
    (typeof server.getEngine() !== 'undefined').should.be.true;
  });

  it('should get host and port', async () => {
    const server = manager.getByName('noop-http');
    server.getHost().should.be.equal('http://localhost:3000');
  });

  it('should get injector', async () => {
    const server = manager.getByName('noop-http');
    (typeof server.getInjector() !== 'undefined').should.be.true;
  });

  it('should dispatch onConnect event', async () => {
    const server = manager.getByName('noop-websocket');
    await injector.get(AsyncEventDispatcher)
      .dispatch(ServerEvents.CONNECTED, new SocketEvent(new EventEmitter(), server));
    injector.get(SocketListener).connected.should.be.true;
  });
});