import {TransportInstance, TransportOptions} from 'winston';

export const LOGGER_NS = 'rxstack.logger';

export interface LoggerTransportInterface {
  createInstance(options: TransportOptions): TransportInstance;
  getName(): string;
}

export interface LoggerHandler {
  type: string;
  options: TransportOptions;
}