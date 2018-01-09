import {BootstrapEvent} from '../../src/bootstrap-event';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ApplicationEvents} from '../../src/application-events';
import {MockService} from './mock.service';
import {Injectable} from 'injection-js';

@Injectable()
export class BootstrapListener {
  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    event.injector.get(MockService).modifiedByBootstrapEvent = true;
  }
}