import 'reflect-metadata';
import {Injector, ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {Kernel} from '@rxstack/kernel';
import {
  AsyncEventDispatcher, EVENT_LISTENER_KEY, EventListenerMetadata,
  ObserverMetadata
} from '@rxstack/async-event-dispatcher';
import {BootstrapEvent} from './bootstrap-event';
import {ApplicationEvents} from './application-events';
import {
  MODULE_KEY, ModuleInterface, ModuleMetadata, ModuleType,
  ProviderDefinition
} from './interfaces';
import {ServerManager} from '@rxstack/server-commons';
import {metadataStorage, ServiceRegistryMetadata} from '@rxstack/service-registry';
import {Logger, LOGGER_NS} from '@rxstack/logger';

export class Application {
  private providers: ProviderDefinition[] = [];
  private injector?: Injector;
  constructor(private module: ModuleInterface) {  }

  async start(): Promise<void> {
    this.resolveModule(this.module);
    this.injector = await this.bootstrap();
    await this.startServers();
  }

  async stop(): Promise<void> {
    await this.stopServers();
    this.providers = null;
    this.injector = null;
  }

  getInjector(): Injector {
    return this.injector;
  }

  private async bootstrap(): Promise<Injector> {
    return Promise.all(this.providers).then(async (providers) => {
      const resolvedProviders = ReflectiveInjector.resolve(providers);
      const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
      const dispatcher = injector.get(AsyncEventDispatcher);
      this.registerLoggerTransports(injector);
      resolvedProviders.forEach((provider: ResolvedReflectiveProvider) => {
        const service = injector.get(provider.key.token);
        this.resolveInjectorAwareService(service, injector);
        this.resolveEventListeners(service, dispatcher);
      });
      const bootstrapEvent = new BootstrapEvent(injector, resolvedProviders);
      await dispatcher.dispatch(ApplicationEvents.BOOTSTRAP, bootstrapEvent);
      injector.get(Kernel).initialize();
      return injector;
    });
  }

  private resolveModule(target: ModuleType): void {
    const moduleMetadata: ModuleMetadata = this.getModuleMetadata(target);
    moduleMetadata.imports.forEach((m) => this.resolveModule(m));
    moduleMetadata.providers.forEach((provider: ProviderDefinition) => this.providers.push(provider));
  }

  private getModuleMetadata(target: ModuleType): ModuleMetadata {

    const moduleMetadata: ModuleMetadata =
      Reflect.getMetadata(MODULE_KEY, target['module'] ? target['module'] : target);

    Array.isArray(target['imports']) ? moduleMetadata.imports.push(...target['imports']) : null;
    Array.isArray(target['providers']) ? moduleMetadata.providers.push(...target['providers']) : null;
    return moduleMetadata;
  }

  private resolveInjectorAwareService(service: Object, injector: Injector): void {
    if (typeof service['setInjector'] !== 'undefined') {
      service['setInjector'](injector);
    }
  }

  private resolveEventListeners(service: Object, dispatcher: AsyncEventDispatcher): void {
    if (Reflect.hasMetadata(EVENT_LISTENER_KEY, service.constructor)) {
      const metadata: EventListenerMetadata = Reflect.getMetadata(EVENT_LISTENER_KEY, service.constructor);
      metadata.observers.forEach((observer: ObserverMetadata) => {
        dispatcher.addListener(
          observer.eventName,
          service[observer.propertyKey].bind(service),
          observer.priority
        );
      });
    }
  }

  private registerLoggerTransports(injector: Injector): void {
    const logger = injector.get(Logger);
    metadataStorage.all(LOGGER_NS).forEach((metadata: ServiceRegistryMetadata) => {
      const transport = injector.get(metadata.target);
      logger.registerTransport(transport);
    });
    logger.init();
  }

  private async startServers(): Promise<void> {
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