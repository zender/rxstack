import {HeaderBag} from './header-bag';

export class Response {
  public headers: HeaderBag = new HeaderBag();
  constructor(public content?: any, public statusCode = 200) { }
}