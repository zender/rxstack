import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {EventEmitter} from 'events';

export class SocketEvent extends GenericEvent {
  constructor(public readonly socket: EventEmitter, public readonly name: string) {
    super();
  }
}