import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerEvents} from '@rxstack/server-commons';

export class ConfiguratonListener {
  @Observe(ServerEvents.PRE_CONFIGURE)
  async onPreConfigure(): Promise<void> {

  }
}