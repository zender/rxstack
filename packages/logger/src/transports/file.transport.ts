import {LOGGER_NS, LoggerTransportInterface} from '../interfaces';
import {FileTransportInstance, FileTransportOptions} from 'winston';
import {ServiceRegistry} from '@rxstack/service-registry';
const winston = require('winston');

@ServiceRegistry(LOGGER_NS, FileTransport.transportName)
export class FileTransport implements LoggerTransportInterface {

  static transportName = 'file';

  createInstance(options: FileTransportOptions): FileTransportInstance {
    options['format'] = winston.format.json();
    return new winston.transports.File(options);
  }

  getName(): string {
    return FileTransport.transportName;
  }
}