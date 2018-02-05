import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Token} from '@rxstack/kernel';

export class AuthenticationEvent extends GenericEvent {
  constructor(public authenticationToken: Token) {
    super();
  }
}