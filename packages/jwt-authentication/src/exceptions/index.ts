import {Exception} from '@rxstack/exceptions';

export class JWTEncodeFailureException extends Exception {
  constructor(message: string, public prevMessage?: string) {
    super(message);
    this.name = 'JWTEncodeFailureException';
  }
}

export class JWTDecodeFailureException extends Exception {
  constructor(message: string, public prevMessage?: string) {
    super(message);
    this.name = 'JWTDecodeFailureException';
  }
}