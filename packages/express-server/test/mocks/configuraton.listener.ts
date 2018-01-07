import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/server-commons';
import {expressMiddleware, requestModifierMiddleware} from './express.middleware';
import {Injectable, Injector} from 'injection-js';
import {ExpressServer} from '../../src/express.server';

@Injectable()
export class ConfiguratonListener {

  private injector: Injector;

  public setInjector(injector: Injector): void {
    this.injector = injector;
  }

  @Observe(ServerEvents.CONFIGURE)
  async onPreConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.name !== ExpressServer.serverName) {
      return;
    }
    event.engine
      .use('/express-middleware', expressMiddleware(this.injector))
      .use('/mock/json', requestModifierMiddleware(this.injector))
    ;
  }
}