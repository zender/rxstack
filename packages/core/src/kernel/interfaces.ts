import {Request} from './models/request';
import {Response} from './models/response';
import {StreamableResponse} from './models/streamable-response';

/**
 * Available http methods
 */
export type HttpMethod = 'HEAD' | 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

/**
 * Available transports
 */
export type Transport = 'HTTP' | 'SOCKET';

/**
 * Available response types
 */
export type ResponseObject = Response | StreamableResponse;

export interface BaseDefinition {
  name: string;
  handler: (request: Request) => Promise<Response>;
}

export interface HttpDefinition extends BaseDefinition {
  path: string;
  method: HttpMethod;
}

export interface WebSocketDefinition extends BaseDefinition { }

export type TransportDefinition = HttpDefinition | WebSocketDefinition;

export interface UserInterface {
  username: string;
  password?: string;
  roles: string[];
}

export interface TokenInterface {
  getCredentials(): string;
  getUsername(): string;
  getRoles(): string[];
  hasRole(role: string): boolean;
  getUser(): UserInterface;
  setUser(user: UserInterface): void;
  setAuthenticated(authenticated: true): void;
  isAuthenticated(): boolean;
  setFullyAuthenticated(fullyAuthenticated: boolean): void;
  isFullyAuthenticated(): boolean;
  setPayload(payload: Object): void;
  getPayload(): Object;
}