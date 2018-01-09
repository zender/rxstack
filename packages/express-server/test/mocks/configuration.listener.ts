import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/server-commons';
import {expressMiddleware, requestModifierMiddleware} from './express.middleware';
import {Injectable, Injector} from 'injection-js';
import {ExpressServer} from '../../src/express.server';

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
      .get('/api/express-middleware', expressMiddleware(this.injector))
      .get('/api/mock/json', requestModifierMiddleware(this.injector))
    ;
  }
}