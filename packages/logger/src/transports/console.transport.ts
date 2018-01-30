import {LOGGER_NS, LoggerTransportInterface} from '../interfaces';
import {ConsoleTransportInstance, ConsoleTransportOptions} from 'winston';
import {ServiceRegistry} from '@rxstack/service-registry';
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

  private createFormatter(): any {
    const formatter = winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf((info: any) => {
        const {
          timestamp, level, message, ...args
        } = info;

        const source = args['source'] ? `[${args['source']}]` : '';

        const ts = timestamp.slice(0, 19).replace('T', ' ');
        return `${source} ${ts} [${level}]: ${message}`;
      }),
    );

    return formatter;
  }
}