import {KernelEvent} from './kernel-event';
import {ResponseObject} from '../interfaces';

/**
 * Allows to create a response for a request.
 */
export class RequestEvent extends KernelEvent {
  /**
   * Sets the response object
   *
   * @param {ResponseObject} response
   */
  setResponse(response: ResponseObject): void {
    super.setResponse(response);
    this.stopPropagation();
  }
}