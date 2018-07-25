/**
 * Defines base Error class
 */
export class Exception implements Error {
  name: string;
  stack?: string;
  data: any;

  constructor(public message: string) {
    Error.captureStackTrace(this);
    this.name = 'Exception';
  }
}