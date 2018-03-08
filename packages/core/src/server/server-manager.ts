import {AbstractServer} from './abstract-server';
import {RouteDefinition} from '../kernel';
import {Injectable} from 'injection-js';

@Injectable()
export class ServerManager {
  servers: Map<string, AbstractServer> = new Map();

  constructor(registry: AbstractServer[]) {
    registry.forEach((server) => this.servers.set(server.getName(), server));
  }

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

  getByName(name: string): AbstractServer {
    return this.servers.get(name);
  }
}