import 'reflect-metadata';
import {Provider, ReflectiveInjector} from 'injection-js';
import {metadataStorage, ServiceRegistryMetadata} from '@rxstack/service-registry';
import {ServerManager} from '../src/server-manager';
import {MockServer} from './mocks/mock.server';

describe('Server', () => {

  // Setup
  const providers: Provider[] = [
    { provide: ServerManager, useClass: ServerManager },
    { provide: MockServer, useClass: MockServer }
  ];
  const resolvedProviders = ReflectiveInjector.resolve(providers);
  const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);

  const manager = injector.get(ServerManager);

  metadataStorage.all(ServerManager.ns).forEach((metadata: ServiceRegistryMetadata) => {
    manager.servers.set(metadata.name, injector.get(metadata.target));
  });

  it('should start the app', async () => {
    manager.start();
  });

});
