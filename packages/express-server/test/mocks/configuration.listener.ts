import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/server-commons';
import {expressMiddleware, requestModifierMiddleware} from './express.middleware';
import {Injectable, Injector} from 'injection-js';
import {ExpressServer} from '../../src/express.server';
import {environment} from '../environments/environment';

@Injectable()
export class ConfigurationListener {

  private injector: Injector;

  public setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @Observe(ServerEvents.CONFIGURE)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.name !== ExpressServer.serverName) {
      return;
    }

    event.engine
      .get(environment.express_server.prefix + '/express-middleware', expressMiddleware(this.injector))
      .get(environment.express_server.prefix + '/mock/json', requestModifierMiddleware(this.injector))
    ;
  }
}