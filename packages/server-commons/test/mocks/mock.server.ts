import {Injectable} from 'injection-js';
import {AbstractServer} from '../../src/abstract-server';
import {ServiceRegistry} from '@rxstack/service-registry';
import {ServerManager} from '../../src/server-manager';

@Injectable()
@ServiceRegistry(ServerManager.ns, 'server.mock')
export class MockServer extends AbstractServer {

  async configure(): Promise<this> {
    return this;
  }

  protected async startEngine(): Promise<this> {
    return this;
  }
}