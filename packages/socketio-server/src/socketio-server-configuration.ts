export class SocketioServerConfiguration {
  host?: string;
  port?: number;
  maxListeners?: number;

  constructor(obj?: any) {
    this.host = obj && obj.host || 'localhost';
    this.port = obj && obj.port || 4000;
    this.maxListeners = obj && obj.maxListeners || 64;
  }
}