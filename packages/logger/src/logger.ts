/**
 * Log level
 */
export type LogLevel = 'emergency'
  | 'alert'
  | 'critical'
  | 'error'
  | 'warning'
  | 'notice'
  | 'info'
  | 'debug';

/**
 * Verbosity
 */
export type LogVerbosityType = 'verbose' | 'info' | 'error' | 'none';

export enum LogVerbosity {
  none,
  error,
  info,
  verbose,
}

/**
 * Logger constructor
 */
export interface LoggerConstructor<T extends Logger> {
  new (): T;
}

/**
 * Logger function
 */
export interface LogFunction {
  (level: LogLevel, ...messages: any[]): void;
}

/**
 * Logger base class
 */
export abstract class Logger {

  protected sourceName: string;
  protected verbosityLevel: LogVerbosity;

  constructor(protected impl: LoggerConstructor<any>) {}

  /**
   * Log emergency message(s) to the log output
   *
   * @param args
   * @returns {Logger}
   */
  public emergency(...args: any[]): this {
    return this.log('emergency', LogVerbosity.error, ...args);
  }

  /**
   * Log alert message(s) to the log output
   * @param args
   * @returns {any}
   */
  public alert(...args: any[]): this {
    return this.log('alert', LogVerbosity.error, ...args);
  }

  /**
   * Log critical message(s) to the log output
   * @param args
   * @returns {any}
   */
  public critical(...args: any[]): this {
    return this.log('critical', LogVerbosity.error, ...args);
  }

  /**
   * Log error message(s) to the log output
   * @param args
   * @returns {any}
   */
  public error(...args: any[]): this {
    return this.log('error', LogVerbosity.error, ...args);
  }

  /**
   * Log warning message(s) to the log output
   * @param args
   * @returns {any}
   */
  public warning(...args: any[]): this {
    return this.log('warning', LogVerbosity.info, ...args);
  }

  /**
   * Log notice message(s) to the log output
   * @param args
   * @returns {any}
   */
  public notice(...args: any[]): this {
    return this.log('notice', LogVerbosity.info, ...args);
  }

  /**
   * Log info message(s) to the log output
   * @param args
   * @returns {any}
   */
  public info(...args: any[]): this {
    return this.log('info', LogVerbosity.info, ...args);
  }

  /**
   * Log debug message(s) to the log output
   * @param args
   * @returns {Logger}
   */
  public debug(...args: any[]): this {
    return this.log('debug', LogVerbosity.verbose, ...args);
  }

  /**
   * Given the log level and list of messages, and if the global verbosity level is satisfied,
   * invoke the persist log method.
   * @param logLevel
   * @param verbosity
   * @param messages
   * @returns {any}
   */
  protected log(logLevel: LogLevel, verbosity: LogVerbosity, ...messages: any[]): this {

    this.setVerbosity(verbosity);

    const globalVerbosity: number = LogVerbosity[(process.env.LOG_LEVEL as string)];

    if (typeof globalVerbosity === 'number' && globalVerbosity < this.verbosityLevel) {
      this.setVerbosity(undefined, true);
      return;
    }

    return this.persistLog(logLevel, messages)
      .setVerbosity(undefined, true); // reset the verbosity to undefined for the next log
  }

  /**
   * Set a string to denote the source of the log. The effect this has on the log output is up
   * to the implementing class.
   * @param sourceName
   * @returns {Logger}
   */
  protected setSource(sourceName: string): this {
    this.sourceName = sourceName;
    return this;
  }

  /**
   * Sets the current log verbosity level, used to compare against the global value to determine
   * whether or not to persist the log. If a verbosity is already set, don't force unless requested.
   * to, as
   * @param level
   * @param force
   * @returns {Logger}
   */
  protected setVerbosity(level: LogVerbosity, force: boolean = false): this {
    if (!force && !!this.verbosityLevel) {
      return this;
    }
    this.verbosityLevel = level;
    return this;
  }

  /**
   * Chainable method to allow forcing the log level to only show when log verbosity level is 'verbose'
   * @returns {Logger}
   */
  public get verbose() {
    return this.setVerbosity(LogVerbosity.verbose, true);
  }

  /**
   * Creates a new instance of the logger class with the source set. This allows the use of
   * passing around log instances to avoid having to set source each time.
   *
   * @param source
   * @returns {any}
   */
  public source(source: string): Logger {
    return new this.impl().setSource(source);
  }

  /**
   * Outputs the log message(s) to the implementation's destination.
   *
   * For example if the implementation is a Loggly logger, it should post the logs to Loggly.
   * @param logLevel
   * @param messages
   */
  public abstract persistLog(logLevel: LogLevel, messages: any[]): this;
}
