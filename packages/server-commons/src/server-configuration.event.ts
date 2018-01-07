import {GenericEvent} from '@rxstack/async-event-dispatcher';

export class ServerConfigurationEvent extends GenericEvent {
  constructor(public readonly engine: any, public readonly name: string) {
    super();
  }
}