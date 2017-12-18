import {HeaderBag} from './header-bag';
import {ResponseType} from '../interfaces';

/**
 * Container for response data
 */
export class Response {
  /**
   * Headers
   * @type {HeaderBag}
   */
  headers: HeaderBag = new HeaderBag();

  /**
   * response type
   */
  type: ResponseType;

  /**
   * Constructor
   *
   * @param content
   * @param {number} statusCode
   */
  constructor(public content?: any, public statusCode = 200) {
    this.type = 'standard';
  }
}