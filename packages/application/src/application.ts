import 'reflect-metadata';
import {Injector, ReflectiveInjector, ResolvedReflectiveProvider} from 'injection-js';
import {Kernel} from '@rxstack/kernel';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {configuration, Configuration} from '@rxstack/configuration';
import {BootstrapEvent} from './bootstrap-event';
import {ApplicationEvents} from './application-events';
import {Module, ProviderDefinition} from './interfaces';
import {MODULE_KEY, ModuleMetadata} from './decorators';

export class Application {
  private providers: ProviderDefinition[] = [];
  private injector: Injector;
  constructor(private module: Module) {}

  async start(): Promise<Injector> {
    this.resolveModule(this.module, configuration);
    const injector = await this.bootstrap(this.providers);
    await this.startServers();

    return injector;
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
      configuration.lock();
      injector.get(Kernel).initialize();
      const bootstrapEvent = new BootstrapEvent(injector, configuration, resolvedProviders);
      await injector.get(AsyncEventDispatcher).dispatch(ApplicationEvents.BOOTSTRAP, bootstrapEvent);
      return injector;
    });
  }

  private resolveModule(target: Module, config: Configuration): void {
    const module: ModuleMetadata = Reflect.getMetadata(MODULE_KEY, target);

    if (Array.isArray(module.imports)) {
      module.imports.forEach((m: Function) => this.resolveModule(m, config));
    }

    module.providers.forEach((provider: ProviderDefinition) => this.providers.push(provider));
    if (module.configuration) {
      module.configuration(config);
    }
  }

  private async startServers(): Promise<void> {

  }
}