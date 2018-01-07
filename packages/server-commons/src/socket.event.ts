import {GenericEvent} from '@rxstack/async-event-dispatcher';

export class SocketEvent extends GenericEvent {
  constructor(public readonly socket: any, public readonly name: string) {
    super();
  }
}