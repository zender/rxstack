import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {TokenInterface} from '@rxstack/kernel';

export class AuthenticationEvent extends GenericEvent {
  constructor(public authenticationToken: TokenInterface) {
    super();
  }
}