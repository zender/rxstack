import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/server-commons';
import {Injectable} from 'injection-js';
import {socketMiddleware} from './socketio.middleware';

@Injectable()
export class ConfiguratonListener {

  @Observe(ServerEvents.PRE_CONFIGURE)
  async onPreConfigure(event: ServerConfigurationEvent): Promise<void> {
    const app = event.server.getEngine();
    const injector = event.server.getInjector();
    app
      .use(socketMiddleware(injector))
    ;
  }
}