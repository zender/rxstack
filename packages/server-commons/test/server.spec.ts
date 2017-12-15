import 'reflect-metadata';
import {Provider, ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {metadataStorage, ServiceRegistryMetadata} from '@rxstack/service-registry';
import {ServerManager} from '../src/server-manager';
import {MockServer} from './mocks/mock.server';
import {AsyncEventDispatcher, asyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {SinonSpy} from 'sinon';
import {AbstractServer} from '../src/abstract-server';
const sinon = require('sinon');

describe('Server', () => {
  // Setup
  const providers: Provider[] = [
    { provide: AsyncEventDispatcher, useValue: asyncEventDispatcher },
    { provide: ServerManager, useClass: ServerManager },
    { provide: MockServer, useClass: MockServer }
  ];
  const resolvedProviders = ReflectiveInjector.resolve(providers);
  const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);

  resolvedProviders.forEach((provider: ResolvedReflectiveProvider) => {
    const service = injector.get(provider.key.token);
    if (service['setInjector']) {
      service.setInjector(injector);
    }
  });

  const manager = injector.get(ServerManager);
  metadataStorage.all(ServerManager.ns).forEach((metadata: ServiceRegistryMetadata) => {
    manager.servers.set(metadata.name, injector.get(metadata.target));
  });

  const server = manager.servers.get('server.mock');

  before(async () => {
    await manager.start();
  });

  it('should start mock server', async () => {
    server.started.should.be.true;
  });

  it('should get host and port', async () => {
    server.getHost().should.be.equal('http://example.com:8080');
  });

  it('should get http server', async () => {
    (typeof server.getHttpServer() === 'undefined').should.be.true;
  });

  it('should get injector', async () => {
    (typeof server.getInjector() !== 'undefined').should.be.true;
  });

  it('should stop mock server', async () => {
    await manager.stop();
    server.started.should.be.false;
  });
});
