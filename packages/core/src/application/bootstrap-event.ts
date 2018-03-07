import {Injector, ResolvedReflectiveProvider} from 'injection-js';
import {GenericEvent} from '@rxstack/async-event-dispatcher';

export class BootstrapEvent extends GenericEvent {
  constructor(public readonly injector: Injector,
              public readonly resolvedProviders: ResolvedReflectiveProvider[]) {
    super();
  }
}