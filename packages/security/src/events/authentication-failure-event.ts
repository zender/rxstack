import {AuthenticationEvent} from './authentication-event';
import {AuthenticationException} from '../exceptions/index';
import {Token} from '@rxstack/kernel';

export class AuthenticationFailureEvent extends AuthenticationEvent {
  constructor(public readonly authenticationToken: Token, public readonly lastException: AuthenticationException) {
    super(authenticationToken);
  }
}