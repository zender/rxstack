import {User} from './user';
import {Credentials} from '../interfaces';

export class Token {
  isAuthenticated = false;
  constructor(public credentials: Credentials , public user?: User) {}

  getUsername(): string {
    return this.user ? this.user.username : null;
  }

  getRoles(): string[] {
    return this.user ? this.user.roles : [];
  }
}