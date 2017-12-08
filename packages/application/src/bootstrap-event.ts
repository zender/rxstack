import {Injector, ResolvedReflectiveProvider} from 'injection-js';
import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Configuration} from '@rxstack/configuration';

export class BootstrapEvent extends GenericEvent {
  constructor(public readonly injector: Injector,
              public readonly configuration: Configuration,
              public readonly resolvedProviders: ResolvedReflectiveProvider[]) {
    super();
  }
}