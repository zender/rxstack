import {Logger} from '../src/logger';
import {FileTransport} from '../src/transports/file.transport';
import {ConsoleTransport} from '../src/transports/console.transport';

describe('Logger', () => {

  const logger = new Logger([
    {
      type: 'file',
      options: {
        filename: '/home/zender/apps/rxstack/rxstack/packages/logger/test/combined.log',
        level: 'error',
      }
    },
    {
      type: 'console',
      options: {
        level: 'info',
      }
    }
  ]);

  logger.registerTransport(new FileTransport());
  logger.registerTransport(new ConsoleTransport());
  logger.init();

  it('should be of Logger', () => {
    logger.source('Zaza').error('jajja');
  });

});