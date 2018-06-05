import {LoggerTransportInterface} from '../interfaces';
import {formatFunc} from '../utils';
import {Injectable} from 'injection-js';
const winston = require('winston');

@Injectable()
export class ConsoleTransport implements LoggerTransportInterface {

  static transportName = 'console';

  createInstance(options: any): any {
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
