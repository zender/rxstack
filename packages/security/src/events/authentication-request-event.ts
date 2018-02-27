import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Request} from '@rxstack/kernel';

export class AuthenticationRequestEvent extends GenericEvent {
  constructor(public readonly request: Request) {
    super();
  }
}