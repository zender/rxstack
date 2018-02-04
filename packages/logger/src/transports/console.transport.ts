import {LOGGER_NS, LoggerTransportInterface} from '../interfaces';
import {ConsoleTransportInstance, ConsoleTransportOptions} from 'winston';
import {ServiceRegistry} from '@rxstack/service-registry';
import {formatFunc} from '../utils';
const winston = require('winston');

@ServiceRegistry(LOGGER_NS, ConsoleTransport.transportName)
export class ConsoleTransport implements LoggerTransportInterface {

  static transportName = 'console';

  createInstance(options: ConsoleTransportOptions): ConsoleTransportInstance {
    options['format'] = this.createFormatter();
    return new winston.transports.Console(options);
  }

  getName(): string {
    return ConsoleTransport.transportName;
  }

  protected createFormatter(): any {
    const formatter = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(formatFunc),
    );
    return formatter;
  }
}
