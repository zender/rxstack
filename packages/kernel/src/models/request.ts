import {ParameterBag} from './parameter-bag';
import {FileBag} from './file-bag';
import {HeaderBag} from './header-bag';
import {AttributeBag} from './attribute-bag';
import {HttpMethod, Transport} from '../interfaces';
import {Token} from './token';
import {EventEmitter} from 'events';

/**
 * Container for request data
 */
export class Request {

  /**
   * Headers
   */
  headers: HeaderBag;

  /**
   * Parameters
   */
  params: ParameterBag;

  /**
   * Files
   */
  files: FileBag;

  /**
   *  Body
   */
  body: any;

  /**
   * Extra data
   */
  attributes: AttributeBag;

  /**
   * Base path
   */
  basePath: string;

  /**
   * Route path
   */
  path: string;

  /**
   * Http method
   */
  method: HttpMethod;

  /**
   * Controller instance
   */
  controller: Object;

  /**
   * Name of th route
   */
  routeName: string;

  /**
   * Security token
   */
  token: Token;

  /**
   * Socket connection
   */
  connection: EventEmitter;

  /**
   * Constructor
   *
   * @param {Transport} transport
   */
  constructor(public readonly transport: Transport) {
    this.headers = new HeaderBag();
    this.params = new ParameterBag();
    this.attributes = new AttributeBag();
    this.files = new FileBag();
  }
}