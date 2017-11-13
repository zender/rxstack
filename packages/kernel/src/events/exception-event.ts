import {KernelEvent} from './kernel-event';
import {Exception} from '@rxstack/exceptions';
import {Request} from '../models/request';

export class ExceptionEvent extends KernelEvent {
  constructor(private exception: Exception, request: Request) {
    super(request);
  }

  setException(exception: Exception): void {
    this.exception = this.exception;
  }

  getException(): Exception {
    return this.exception;
  }
}