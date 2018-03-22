export class ExpressServerConfiguration {
  host?: string;
  port?: number;
  prefix?: string;

  constructor(obj?: any) {
    this.host = obj && obj['host'] || 'localhost';
    this.port = obj && obj['port'] || 3000;
    this.prefix = obj && obj['prefix'] || null;
  }
}