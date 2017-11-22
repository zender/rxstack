import {Request} from './models/request';
import {Response} from './models/response';

export type HttpMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

export type Transport = 'HTTP' | 'SOCKET';

export interface RouteDefinition {
  path: string;
  routeName: string;
  method: HttpMethod;
  handler: (request: Request) => Promise<Response>;
}

export type Credentials =  {
  username?: string;
  password?: string;
};