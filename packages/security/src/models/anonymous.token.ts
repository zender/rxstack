import {AbstractToken} from './abstract-token';

export class AnonymousToken extends AbstractToken {
  constructor() {
    super();
    this.setAuthenticated(false);
  }
  getUsername(): string {
    return 'anon';
  }

  getCredentials(): string {
    return null;
  }

  eraseCredentials(): void { }
}