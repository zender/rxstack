import {Logger, LogLevel} from './logger';
import { inspect } from 'util';
import * as moment from 'moment';
const Chalk = require('chalk');

/**
 * Console Logger
 */
export class ConsoleLogger extends Logger {

  public constructor() {
    super(ConsoleLogger);
  }

  /**
   * Output the log to console. The log messages are prepended with the current time and source if
   * set
   * @param logLevel
   * @param messages
   * @returns {ConsoleLogger}
   */
  public persistLog(logLevel: LogLevel, messages: any[]): this {

    messages = this.formatMessages(logLevel, messages);

    if (this.sourceName) {
      messages.unshift(Chalk.gray('[' + this.format(logLevel, this.sourceName) + ']'));
    }

    messages.unshift(Chalk.gray('[' + this.format(logLevel, moment()
        .format('HH:mm:ss')) + '] '));

    switch (logLevel) {
      case 'emergency':
      case 'alert':
      case 'critical':
      case 'error':
        console.error(messages.shift(), ...messages);
        break;
      case 'warning':
      case 'notice':
        console.warn(messages.shift(), ...messages);
        break;
      default:
        console.log(messages.shift(), ...messages);
    }
    return this;
  }

  /**
   * Format the log with an appropriate colour
   * @param logLevel
   * @param message
   * @returns {string}
   */
  private format(logLevel: LogLevel, message: string) {
    switch (logLevel) {
      case 'emergency':
        message = Chalk.bgRed(message);
        break;
      case 'alert':
        message = Chalk.red.underline(message);
        break;
      case 'critical':
        message = Chalk.yellow.underline(message);
        break;
      case 'warning':
        message = Chalk.yellow(message);
        break;
      case 'notice':
        message = Chalk.magenta(message);
        break;
      case 'info':
        message = Chalk.blue(message);
        break;
      case 'debug':
        message = Chalk.gray(message);
        break;
    }

    return message;
  }

  /**
   * Format the messages - in node env anything that is not a string is passed into util.inspect
   * for coloured syntax highlighting
   * @param logLevel
   * @param messages
   * @returns {any}
   */
  private formatMessages(logLevel: LogLevel, messages: any[]): any[] {
    return messages.map((message) => {
      switch (typeof message) {
        case 'string' :
          return this.format(logLevel, message);
        default:
          return inspect(message, {
            colors: true
          });
      }
    });
  }

}
