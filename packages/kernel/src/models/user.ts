export class User {
  constructor(public username?: string, public password?: string, public roles: string[] = []) {}

  hasRole(role: string): boolean {
    return !!this.roles.find((value: string) => value === role);
  }
}