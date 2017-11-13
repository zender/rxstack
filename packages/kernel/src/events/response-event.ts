import {KernelEvent} from './kernel-event';
import {Request} from '../models/request';
import {Response} from '../models/response';

export class ResponseEvent extends KernelEvent {
  constructor(request: Request, response: Response) {
    super(request);
    this.setResponse(response);
  }
}