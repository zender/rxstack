import {TransportInstance, TransportOptions} from 'winston';

export const LOGGER_NS = 'rxstack.logger';

export type LoggingLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

export interface LoggerTransportInterface {
  createInstance(options: TransportOptions): TransportInstance;
  getName(): string;
}

export interface LoggerHandler {
  type: string;
  options: TransportOptions;
}
