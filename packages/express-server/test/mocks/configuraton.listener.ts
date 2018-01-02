import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/server-commons';
import {expressMiddleware, requestModifierMiddleware} from './express.middleware';
import {Injectable} from 'injection-js';

@Injectable()
export class ConfiguratonListener {

  @Observe(ServerEvents.PRE_CONFIGURE)
  async onPreConfigure(event: ServerConfigurationEvent): Promise<void> {
    const app = event.server.getEngine();
    const injector = event.server.getInjector();
    app
      .use('/express-middleware', expressMiddleware(injector))
      .use('/mock/json', requestModifierMiddleware(injector))
    ;
  }

  @Observe(ServerEvents.POST_CONFIGURE)
  async onPostConfigure(): Promise<void> {

  }
}