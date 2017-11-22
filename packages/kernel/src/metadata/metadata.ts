import {HttpMethod} from '../interfaces';

export class ControllerMetadata {
  target: Function;
  path: string;
}

export class RouteMetadata extends ControllerMetadata {
  httpMethod: HttpMethod;
  name: string;
  propertyKey: string;
}
