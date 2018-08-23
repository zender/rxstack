/**
 * Defines base Error class
 */
export class Exception implements Error {
  stack?: string;
  data: any;

  constructor(public message: string, public name = 'Exception') {
    Error.captureStackTrace(this);
  }
}