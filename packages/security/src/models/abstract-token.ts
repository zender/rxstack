import {TokenInterface, UserInterface} from '@rxstack/kernel';

export abstract class AbstractToken implements TokenInterface {

  protected user: UserInterface;

  protected roles: string[] = [];

  protected authenticated = false;

  getRoles(): string[] {
    return this.roles;
  }

  getUser(): UserInterface {
    return this.user;
  }

  setUser(user: UserInterface): void {
    this.user = user;
  }

  setAuthenticated(authenticated: boolean): void {
    this.authenticated = authenticated;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  abstract getUsername(): string;

  abstract getCredentials(): string;
}