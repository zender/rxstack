import {HttpException} from './http.exception';

/**
 * Defines Error class for Conflict errors, with HTTP status code 409
 */
export class ConflictException extends HttpException {
  constructor(message: string = 'Conflict') {
    super(message);
    this.name = 'ConflictException';
    this.statusCode = 409;
  }
}