import 'reflect-metadata';
import {Injector, ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {Kernel} from '@rxstack/kernel';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {configuration, Configuration} from '@rxstack/configuration';
import {BootstrapEvent} from './bootstrap-event';
import {ApplicationEvents} from './application-events';
import {MODULE_KEY, ModuleInterface, ModuleMetadata, ProviderDefinition} from './interfaces';
import {ServerManager} from '@rxstack/server-commons';
import {metadataStorage, ServiceRegistryMetadata} from '@rxstack/service-registry';

export class Application {
  private providers: ProviderDefinition[];
  private injector: Injector;
  constructor(private module: ModuleInterface) {}

  async start(): Promise<Injector> {
    this.providers = [];
    this.resolveModule(this.module, configuration);
    this.injector = await this.bootstrap(this.providers);
    await this.startServers(configuration);
    return this.injector;
  }

  async stop(): Promise<void> {
    await this.stopServers();
  }

  private async bootstrap(providerDef: ProviderDefinition[]): Promise<Injector> {
    return Promise.all(providerDef).then(async (providers) => {
      const resolvedProviders = ReflectiveInjector.resolve(providers);
      const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
      resolvedProviders.forEach((provider: ResolvedReflectiveProvider) => {
        const service = injector.get(provider.key.token);
        if (service['setInjector']) {
          service.setInjector(injector);
        }
      });
      injector.get(Kernel).initialize();
      const bootstrapEvent = new BootstrapEvent(injector, configuration, resolvedProviders);
      await injector.get(AsyncEventDispatcher).dispatch(ApplicationEvents.BOOTSTRAP, bootstrapEvent);
      return injector;
    });
  }

  private resolveModule(target: ModuleInterface, config: Configuration): void {
    const module: ModuleMetadata = Reflect.getMetadata(MODULE_KEY, target);
    if (Array.isArray(module.imports)) {
      module.imports.forEach((m: ModuleInterface) => this.resolveModule(m, config));
    }
    module.providers.forEach((provider: ProviderDefinition) => this.providers.push(provider));
    if (module.configuration) {
      module.configuration(config);
    }
  }

  private async startServers(configuration: Configuration): Promise<void> {
    const routeDefinitions = this.injector.get(Kernel).getRouteDefinitions();
    const manager = this.injector.get(ServerManager);
    metadataStorage.all(ServerManager.ns).forEach((metadata: ServiceRegistryMetadata) => {
      const server = this.injector.get(metadata.target, false);
      if (server) {
        manager.servers.set(metadata.name, this.injector.get(metadata.target));
      }
    });
    await manager.start(routeDefinitions);
  }

  private async stopServers(): Promise<void> {
    const manager = this.injector.get(ServerManager);
    await manager.stop();
  }
}