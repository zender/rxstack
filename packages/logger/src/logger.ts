import {Winston} from 'winston';
import {LoggerHandler, LoggerTransportInterface, LoggingLevel} from './interfaces';
const winstonLogger = require('winston');

export class Logger {

  private sourceName?: string;

  private winston: Winston;

  private transports: Map<string, LoggerTransportInterface> = new Map();

  constructor(private handlers: LoggerHandler[]) { }

  registerTransport(transport: LoggerTransportInterface): this {
    if (this.transports.has(transport.getName())) {
      throw new Error(`Transport "${transport.getName()}" already exists.`);
    }
    this.transports.set(transport.getName(), transport);
    return this;
  }

  source(source: string): this {
    this.sourceName = source;
    return this;
  }

  error(message: string, meta?: any): this {
    return this.log('error', message, meta);
  }

  warning(message: string, meta?: any): this {
    return this.log('warn', message, meta);
  }

  info(message: string, meta?: any): this {
    return this.log('info', message, meta);
  }

  debug(message: string, meta?: any): this {
    return this.log('debug', message, meta);
  }

  verbose(message: string, meta?: any): this {
    return this.log('verbose', message, meta);
  }
  
  silly(message: string, meta?: any): this {
    return this.log('silly', message, meta);
  }

  log(logLevel: LoggingLevel, message: string, meta?: any) {
    meta = meta ? meta : {};
    this.winston.log(logLevel, message, Object.assign({}, meta, {'source': this.sourceName}));
    return this;
  }

  init(): this {
    this.handlers.forEach((handler) => {
      if (!this.transports.has(handler.type)) {
        throw new Error(`Transport "${handler.type}" does not exist.`);
      }
      const transportInstance = this.transports.get(handler.type).createInstance(handler.options);
      winstonLogger.add(transportInstance);
    });
    this.winston = winstonLogger;
    return this;
  }
}
