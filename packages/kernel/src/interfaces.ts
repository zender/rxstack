import {Request} from './models/request';
import {Response} from './models/response';
import {StreamableResponse} from './models/streamable-response';

/**
 * Available http methods
 */
export type HttpMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

/**
 * Available transports
 */
export type Transport = 'HTTP' | 'SOCKET';

/**
 * Available response types
 */
export type ResponseObject = Response | StreamableResponse;

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