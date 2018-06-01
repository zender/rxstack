import {HttpException} from './http.exception';

/**
 * Defines Error class for Precondition Failed errors, with HTTP status code 412
 */
export class PreconditionFailedException extends HttpException {
  constructor(message = 'Precondition Failed') {
    super(message);
    this.name = 'PreconditionFailedException';
    this.statusCode = 412;
  }
}