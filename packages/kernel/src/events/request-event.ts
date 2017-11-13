import {KernelEvent} from './kernel-event';
import {Response} from '../models/response';

export class RequestEvent extends KernelEvent {
  public setResponse(response: Response): void {
    super.setResponse(response);
    this.stopPropagation();
  }
}