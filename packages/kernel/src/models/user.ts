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
}