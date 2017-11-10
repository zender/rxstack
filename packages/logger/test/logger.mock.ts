import {Logger, LogLevel} from '../src/logger';

export class LoggerMock extends Logger {

  constructor() {
    super(LoggerMock);
  }

  /**
   * @inheritdoc
   */
  public persistLog(logLevel: LogLevel, messages: any[]): this {
    return this;
  }
}
