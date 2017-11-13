import {Request} from './models/request';
import {Response} from './models/response';
import {Injector} from 'injection-js';

export type HttpMethod = 'GET' | 'PUT' | 'PATCH' | 'POST' | 'DELETE';

export interface MethodDefinition {
  method: HttpMethod;
  route: string;
}

export interface RouteDefinition {
  basePath: string;
  path: string;
  methodName: string;
  method: HttpMethod;
  handler: (request: Request) => Promise<Response>;
}

export interface InjectorAwareInterface {
  setInjector(injector: Injector): void;
}