import 'reflect-metadata';
import {Injector, ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {Kernel} from '../kernel';
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
import {ServerManager} from '../server';
import {CORE_PROVIDERS} from './CORE_PROVDERS';
import {ApplicationOptions} from './application-options';

export class Application {
  private providers: ProviderDefinition[];
  private injector?: Injector;
  constructor(private module: ModuleInterface, private options: ApplicationOptions) {  }

  async start(): Promise<this> {
    this.providers = [];
    this.resolveModule(this.module);
    this.injector = await this.doBootstrap();

    if (false === this.options.skipServers) {
      const routeDefinitions = this.injector.get(Kernel).getRouteDefinitions();
      const manager = this.injector.get(ServerManager);
      await manager.start(routeDefinitions);
    }
    return this;
  }

  async stop(): Promise<this> {
    if (false === this.options.skipServers) {
      const manager = this.injector.get(ServerManager);
      await manager.stop();
    }
    return this;
  }

  getInjector(): Injector {
    return this.injector;
  }

  private async doBootstrap(): Promise<Injector> {
    return Promise.all(this.providers).then(async (providers) => {
      const resolvedProviders = ReflectiveInjector.resolve(CORE_PROVIDERS(this.options).concat(providers));
      const injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
      const dispatcher = injector.get(AsyncEventDispatcher);
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
    if (Array.isArray(service)) {
      service.forEach((s: Object) => this.resolveInjectorAwareService(s, injector));
    } else if (typeof service['setInjector'] !== 'undefined') {
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
}