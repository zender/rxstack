import {Token} from '@rxstack/kernel';

export abstract class SecurityException extends Error {

  protected data: any;

  constructor(public message: string) {
    super(message);
    this.name = 'SecurityException';
  }

  public getData(): any {
    return this.data;
  }
}

export class AuthenticationException extends SecurityException {
  public token: Token;
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

export class AuthenticationServiceException extends AuthenticationException {
  constructor() {
    super();
    this.name = 'AuthenticationServiceException';
  }
}

export class UnsupportedUserException extends AuthenticationServiceException {
  constructor() {
    super();
    this.name = 'UnsupportedUserException';
  }
}

export class UserNotFoundException extends AuthenticationException {
  constructor(public readonly username: string) {
    super();
    this.name = 'UsernameNotFoundException';
  }
}

export class ProviderNotFoundException extends SecurityException {
  constructor(message: string = 'No authentication provider found to support the authentication token.') {
    super(message);
    this.name = 'ProviderNotFoundException';
  }
}
