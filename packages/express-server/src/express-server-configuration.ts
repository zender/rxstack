export class ExpressServerConfiguration {
  host?: string;
  port?: number;
  prefix?: string;

  constructor(obj?: Object) {
    this.host = obj && obj['host'] || 'localhost';
    this.port = obj && obj['port'] || 300;
    this.prefix = obj && obj['prefix'] || null;
  }
}