import {LoggerTransportInterface} from '../interfaces';
import {formatFunc} from '../utils';
import {Injectable} from 'injection-js';
const winston = require('winston');

@Injectable()
export class FileTransport implements LoggerTransportInterface {

  static transportName = 'file';

  createInstance(options: any): any {
    options['format'] = this.createFormatter();
    return new winston.transports.File(options);
  }

  getName(): string {
    return FileTransport.transportName;
  }

  protected createFormatter(): any {
    const formatter = winston.format.combine(
      winston.format.timestamp(),
      winston.format.align(),
      winston.format.printf(formatFunc),
      winston.format.json()
    );
    return formatter;
  }
}
