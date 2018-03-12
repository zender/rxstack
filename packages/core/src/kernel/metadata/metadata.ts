import {HttpMethod} from '../interfaces';

export class BaseMetadata {
  target: Function;
  name: string;
  propertyKey: string;
}

export class HttpMetadata extends BaseMetadata {
  path: string;
  httpMethod: HttpMethod;
}

export class WebSocketMetadata extends BaseMetadata {
  ns: string;
}
