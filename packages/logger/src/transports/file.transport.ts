import {LOGGER_NS, LoggerTransportInterface} from '../interfaces';
import {FileTransportInstance, FileTransportOptions} from 'winston';
import {ServiceRegistry} from '@rxstack/service-registry';
import {formatFunc} from '../utils';
const winston = require('winston');

@ServiceRegistry(LOGGER_NS, FileTransport.transportName)
export class FileTransport implements LoggerTransportInterface {

  static transportName = 'file';

  createInstance(options: FileTransportOptions): FileTransportInstance {
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
