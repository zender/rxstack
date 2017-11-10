import {LoggerMock} from './logger.mock';
import {Logger} from '../src/logger';

describe('LoggerMock', () => {
  const logger = new LoggerMock();

  it('should be instance of Logger', () => {
    logger.should.be.an.instanceof(Logger);
  });
});