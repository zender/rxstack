/**
 * Base user class
 */
export class User {
  /**
   * Constructor
   *
   * @param {string} username
   * @param {string} password
   * @param {string[]} roles
   */
  constructor(public username?: string, public password?: string, public roles: string[] = []) {}

  /**
   * Checks if user has a specific role
   *
   * @param {string} role
   * @returns {boolean}
   */
  hasRole(role: string): boolean {
    return !!this.roles.find((value: string): boolean => value === role);
  }
}