import {Request} from './models/request';
import {Response} from './models/response';

/**
 * Available http methods
 */
export type HttpMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

/**
 * Available transports
 */
export type Transport = 'HTTP' | 'SOCKET';

/**
 * Route Definition
 */
export interface RouteDefinition {
  path: string;
  routeName: string;
  method: HttpMethod;
  handler: (request: Request) => Promise<Response>;
}

/**
 *  Token credentials
 */
export type Credentials =  {
  username?: string;
  password?: string;
};