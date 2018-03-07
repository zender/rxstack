import {TransportInstance, TransportOptions} from 'winston';
import {InjectionToken} from 'injection-js';

export type LoggingLevel = 'error' | 'warn' | 'info' | 'verbose' | 'debug' | 'silly';

export interface LoggerTransportInterface {
  createInstance(options: TransportOptions): TransportInstance;
  getName(): string;
}

export interface LoggerHandler {
  type: string;
  options: TransportOptions;
}

export const LOGGER_TRANSPORT_REGISTRY = new InjectionToken<LoggerTransportInterface[]>('LOGGER_TRANSPORT_REGISTRY');
