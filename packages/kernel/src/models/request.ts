import {ParameterBag} from './parameter-bag';
import {FileBag} from './file-bag';
import {HeaderBag} from './header-bag';
import {AttributeBag} from './attribute-bag';
import {HttpMethod, Transport} from '../interfaces';
import {Token} from './token';

export class Request {

  public headers: HeaderBag;

  public query: ParameterBag;

  public params: ParameterBag;

  public files: FileBag;

  public body: any;

  public attributes: AttributeBag;

  public basePath: string;

  public path: string;

  public method: HttpMethod;

  public controller: Object;

  public methodName: string;

  public token: Token;

  public constructor(public readonly transport: Transport) {
    this.headers = new HeaderBag();
    this.query = new ParameterBag();
    this.params = new ParameterBag();
    this.attributes = new AttributeBag();
    this.files = new FileBag();
  }
}