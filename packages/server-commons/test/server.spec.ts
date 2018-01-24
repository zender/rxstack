import 'reflect-metadata';
import {Provider, ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {metadataStorage, ServiceRegistryMetadata} from '@rxstack/service-registry';
import {ServerManager} from '../src/server-manager';
import {MockServer} from './mocks/mock.server';
import {AsyncEventDispatcher, asyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Logger, ConsoleLogger} from '@rxstack/logger';

describe('Server', () => {
  // Setup
  const providers: Provider[] = [
    { provide: AsyncEventDispatcher, useValue: asyncEventDispatcher },
    { provide: ServerManager, useClass: ServerManager },
    { provide: Logger, useClass: ConsoleLogger },
    { provide: MockServer, useClass: MockServer }
  ];
  const resolvedProviders = ReflectiveInjector.resolve(providers);
  const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);

  resolvedProviders.forEach((provider: ResolvedReflectiveProvider) => {
    const service = injector.get(provider.key.token);
    if (typeof service['setInjector'] !== 'undefined') {
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

  after(async() =>  {
    await manager.stop();
  });

  it('should get host and port', async () => {
    server.getHost().should.be.equal('http://localhost:4242');
  });

  it('should get http server', async () => {
    (typeof server.getHttpServer() !== 'undefined').should.be.true;
  });

  it('should get engine', async () => {
    (typeof server.getEngine() !== 'undefined').should.be.true;
  });

  it('should get injector', async () => {
    (typeof server.getInjector() !== 'undefined').should.be.true;
  });
});
