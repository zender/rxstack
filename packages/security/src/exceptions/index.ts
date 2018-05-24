import {UnauthorizedException} from '@rxstack/exceptions';
import {TokenInterface} from '@rxstack/core';


export class AuthenticationException extends UnauthorizedException {
  token: TokenInterface;
  constructor(message = 'Authentication Exception' ) {
    super(message);
    this.name = 'AuthenticationException';
  }
}

export class BadCredentialsException extends AuthenticationException {
  constructor(message: string) {
    super(message);
    this.name = 'BadCredentialsException';
  }
}

export class UserNotFoundException extends AuthenticationException {
  constructor(public readonly username: string) {
    super('UsernameNotFoundException');
    this.name = 'UsernameNotFoundException';
  }
}

export class ProviderNotFoundException extends UnauthorizedException {
  constructor(message: string = 'No authentication provider found to support the authentication token.') {
    super(message);
    this.name = 'ProviderNotFoundException';
  }
}
