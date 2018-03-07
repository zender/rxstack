import {AbstractServer} from './abstract-server';
import {RouteDefinition} from '../kernel';

export class ServerManager {
  static ns = 'server';
  servers: Map<string, AbstractServer> = new Map();

  async start(routeDefinitions: RouteDefinition[]): Promise<void> {
    Array.from(this.servers.values()).reduce(async (current: Promise<void>, server: AbstractServer): Promise<void> => {
      current.then(async () => {
        await server.start(routeDefinitions);
      });
    }, Promise.resolve(null));
  }

  async stop(): Promise<void> {
    const promises: Promise<void>[] = [];
    Array.from(this.servers.values()).forEach((server) => promises.push(server.stopEngine()));
    await Promise.all(promises);
  }
}