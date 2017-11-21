import {RequestEvent} from '../../src/events/request-event';
import {Response} from '../../src/models/response';
import {Observe} from '@rxstack/async-event-dispatcher';
import {KernelEvents} from '../../src/kernel-events';
import {Injectable} from 'injection-js';

@Injectable()
export class AnnotatedListener {
  @Observe(KernelEvents.KERNEL_REQUEST)
  async onRequest(event: RequestEvent): Promise<void> {
    if (event.getRequest().params.get('type') !== 'test_request_event') {
      return;
    }

    await this.handleRequestEvent(event);
  }

  private async handleRequestEvent(event: RequestEvent): Promise<void> {
    const response = new Response('modified_by_request_event');
    event.setResponse(response);
  }
}