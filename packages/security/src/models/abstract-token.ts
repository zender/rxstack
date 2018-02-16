import {TokenInterface, UserInterface} from '@rxstack/kernel';

export abstract class AbstractToken implements TokenInterface {

  protected user: UserInterface;

  protected roles: string[] = [];

  protected authenticated = false;

  protected fullyAuthenticated = false;

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

  setFullyAuthenticated(fullyAuthenticated: boolean): void {
    this.fullyAuthenticated = fullyAuthenticated;
  }

  isFullyAuthenticated(): boolean {
    return this.fullyAuthenticated;
  }

  getRoles(): string[] {
    return this.user ? this.user.roles : [];
  }

  hasRole(role: string): boolean {
    return !!this.getRoles().find((value: string) => value === role);
  }

  getPayload(): Object {
    return {
      username: this.getUsername(),
      roles: this.getRoles()
    };
  }

  abstract getUsername(): string;

  abstract getCredentials(): string;
}