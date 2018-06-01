import {HttpException} from './http.exception';

/**
 * Defines Error class for Insufficient Storage errors, with HTTP status code 503
 */
export class InsufficientStorageException extends HttpException {
  constructor(message = 'Insufficient Storage') {
    super(message);
    this.name = 'InsufficientStorageException';
    this.statusCode = 507;
  }
}