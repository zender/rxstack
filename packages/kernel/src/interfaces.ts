import {Request} from './models/request';
import {Response} from './models/response';

export type HttpMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

export interface MethodDefinition {
  method: HttpMethod;
  route: string;
}

export interface RouteDefinition {
  basePath: string;
  path: string;
  controllerName: string;
  methodName: string;
  method: HttpMethod;
  handler: (request: Request) => Promise<Response>;
}

export type Credentials =  {
  username?: string;
  password?: string;
};