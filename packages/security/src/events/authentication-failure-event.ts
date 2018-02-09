import {AuthenticationEvent} from './authentication-event';
import {AuthenticationException} from '../exceptions/index';
import {TokenInterface} from '@rxstack/kernel';

export class AuthenticationFailureEvent extends AuthenticationEvent {
  constructor(public readonly authenticationToken: TokenInterface, public readonly lastException: AuthenticationException) {
    super(authenticationToken);
  }
}