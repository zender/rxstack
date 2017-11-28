import {HttpMethod} from '../interfaces';

/**
 * Contains controller metadata
 */
export class ControllerMetadata {
  target: Function;
  path: string;
}

/**
 * Contains route metadata
 */
export class RouteMetadata extends ControllerMetadata {
  httpMethod: HttpMethod;
  name: string;
  propertyKey: string;
}
