import {ParameterBag} from './parameter-bag';

export class Response {
  public headers: ParameterBag = new ParameterBag();
  constructor(public content?: any, public statusCode = 200) {
    this.headers.set('Content-Type', 'application/json');
  }
}