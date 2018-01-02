import {User} from './user';
import {Credentials} from '../interfaces';

/**
 * Security Token
 */
export class Token {

  /**
   * Whether token is authenticated or not
   *
   * @type {boolean}
   */
  isAuthenticated = false;

  /**
   * Constructor
   *
   * @param {Credentials} credentials
   * @param {User} user
   */
  constructor(public credentials?: Credentials , public user?: User) {}

  /**
   * Retrieves username
   *
   * @returns {string}
   */
  getUsername(): string {
    return this.user ? this.user.username : null;
  }

  /**
   * Retrieves roles
   *
   * @returns {string[]}
   */
  getRoles(): string[] {
    return this.user ? this.user.roles : [];
  }
}