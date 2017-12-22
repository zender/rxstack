import {GenericEvent} from '@rxstack/async-event-dispatcher';
import {Request} from '../models/request';
import {ResponseObject} from '../interfaces';

/**
 * Base class for kernel events.
 */
export class KernelEvent extends GenericEvent {

  /**
   * Response object
   */
  private response?: ResponseObject;

  /**
   * Constructor
   *
   * @param {Request} request
   */
  constructor(private readonly request: Request) {
    super();
  }

  /**
   * Retrieves the request
   *
   * @returns {Request}
   */
  getRequest(): Request {
    return this.request;
  }

  /**
   * Sets the response
   *
   * @param {ResponseObject} response
   */
  setResponse(response: ResponseObject): void {
    this.response = response;
  }

  /**
   * Retrieves the response
   *
   * @returns {ResponseObject}
   */
  getResponse(): ResponseObject {
    return this.response;
  }

  /**
   * Checks if response is set
   *
   * @returns {boolean}
   */
  hasResponse(): boolean {
    return !!this.getResponse();
  }
}