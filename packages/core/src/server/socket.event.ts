import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {EventEmitter} from 'events';
import {AbstractServer} from './abstract-server';

export class SocketEvent extends GenericEvent {
  constructor(public socket: EventEmitter, public readonly server: AbstractServer) {
    super();
  }
}