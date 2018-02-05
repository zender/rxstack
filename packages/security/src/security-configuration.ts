export class SecurityConfiguration {
  providers: string;
  encoders: string;
  login: string;
  logout: string;

  constructor(obj?: any) {
    this.host = obj && obj['host'] || 'localhost';
  }
}