import {Exception} from './exception';

/**
 * Defines Error class for abstract http exception
 */
export abstract class HttpException extends Exception {

  statusCode = 500;

  constructor(message: string) {
    super(message);
    this.name = 'HttpException';
  }
}