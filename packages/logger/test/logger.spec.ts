import {Logger} from '../src/logger';
import {ConsoleTestTransport} from './console-test.transport';
import * as _ from 'lodash';
const stdMocks = require('std-mocks');

describe('Logger', () => {

  const logger = new Logger([
    {
      type: 'console.test',
      options: {
        level: 'silly',
      }
    }
  ]);

  logger.registerTransport(new ConsoleTestTransport());
  logger.init();

  it('should output error without source', () => {
    stdMocks.use();
    logger.error('some error');
    stdMocks.restore();

    const output = stdMocks.flush();
    const consoleOutput = output.stderr.pop();
    consoleOutput.includes('some error').should.be.true;
  });

  it('should output debug with source', () => {
    stdMocks.use();
    logger.source('TestSource').debug('another error', {'prop': 'my prop'});
    stdMocks.restore();

    const output = stdMocks.flush();
    const consoleOutput = output.stderr.pop();
    consoleOutput.includes('[TestSource]').should.be.true;
    consoleOutput.includes('another error').should.be.true;
    consoleOutput.includes('my prop').should.be.true;
  });

  it('should output message type', () => {
    const types: string[] = ['info', 'warning', 'verbose', 'silly'];

    stdMocks.use();
    types.forEach((type) => {
      logger[type](type);
    });
    stdMocks.restore();
    const output = stdMocks.flush();

    _.forEach(output.stdout, (message: string, i: number) => {
      message.includes(types[i]).should.be.true;
    });
  });

  it('should not be able to register transport again', () => {
    const fn = () => {
      logger.registerTransport(new ConsoleTestTransport());
    };
    fn.should.throw('already exists');
  });

  it('should throw an exception if transport does not exist', () => {
    const fn = () => {
      const newLogger = new Logger([
        {
          type: 'console.test',
          options: {
            level: 'silly',
          }
        }
      ]);
      newLogger.init();
    };
    fn.should.throw('does not exist');
  });

});
