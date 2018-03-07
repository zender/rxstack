import {KernelEvent} from './kernel-event';
import {Request} from '../models/request';
import {ResponseObject} from '../interfaces';

/**
 * Allows to modify the response object
 */
export class ResponseEvent extends KernelEvent {
  /**
   * Constructor
   *
   * @param {Request} request
   * @param {ResponseObject} response
   */
  constructor(request: Request, response: ResponseObject) {
    super(request);
    this.setResponse(response);
  }
}