import {Injectable} from 'injection-js';
import {Service1} from './service1';

@Injectable()
export class Service3 {
  private _service1?: Service1;

  setService1(service1: Service1): void {
    this._service1 = service1;
  }

  getService1(): Service1 {
    return this._service1;
  }
}