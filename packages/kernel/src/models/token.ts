import {User} from './user';

export class Token {

  private authenticated = false;

  constructor(public username?: string, public password?: string , public user?: User) {}

  getRoles(): string[] {
    return this.user.roles;
  }

  getUsername(): string {
    return this.user.username;
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  public setAuthenticated(isAuthenticated: boolean): void {
    this.authenticated = isAuthenticated;
  }

  getCredentials(): string {
    return this.password;
  }
}