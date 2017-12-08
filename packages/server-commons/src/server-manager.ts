import {AbstractServer} from './abstract-server';
import {Injectable} from 'injection-js';

@Injectable()
export class ServerManager {
  static ns = 'server';
  servers: Map<string, AbstractServer> = new Map();

  async start(): Promise<void> {
    Array.from(this.servers.values()).reduce((current: Promise<void>, server: AbstractServer): Promise<void> => {
      return current.then(async () => {
        await server.configure();
        await server.start();

      });
    }, Promise.resolve(null));
  }
}