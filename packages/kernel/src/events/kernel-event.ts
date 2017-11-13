import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Response} from '../models/response';
import {Request} from '../models/request';

export class KernelEvent extends GenericEvent {

  private response?: Response;

  constructor(private readonly request: Request) {
    super();
  }

  getRequest(): Request {
    return this.request;
  }

  setResponse(response: Response): void {
    this.response = response;
  }

  getResponse(): Response {
    return this.response;
  }

  hasResponse(): boolean {
    return !!this.getResponse();
  }
}