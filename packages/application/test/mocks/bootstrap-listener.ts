import {BootstrapEvent} from '../../src/bootstrap-event';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ApplicationEvents} from '../../src/application-events';
import {MockService} from './mock.service';

export class BootstrapListener {
  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    event.injector.get(MockService).modifiedByBootstrapEvent = true;
  }
}