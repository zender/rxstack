import {ConsoleLogger} from '../src/console.logger';
import {LogLevel} from '../src/logger';
import {SinonSpy} from 'sinon';

const chalk = require('chalk');
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
chalk.enabled = false;

describe('Console Logger', () => {
  let logger: ConsoleLogger;
  let consoleLogSpy: SinonSpy;
  let consoleErrorSpy: SinonSpy;
  let consoleWarnSpy: SinonSpy;
  const envLevel = process.env.LOG_LEVEL;

  beforeEach(() => {
    logger = new ConsoleLogger();
    consoleLogSpy = sinon.spy(console, 'log');
    consoleErrorSpy = sinon.spy(console, 'error');
    consoleWarnSpy = sinon.spy(console, 'warn');
  });

  afterEach(() => {
    consoleLogSpy.restore();
    consoleErrorSpy.restore();
    consoleWarnSpy .restore();
    process.env.LOG_LEVEL = envLevel;
  });

  it('logs to the console with a timestamp', () => {
    logger.info('example');

    expect(console.log).to.be.called;
    expect(consoleLogSpy.getCall(0).args[0]).to.match(/\[\d{2}:\d{2}:\d{2}\]/);
    expect(consoleLogSpy.getCall(0).args[1]).to.be.equal('example');
  });

  it('can have a prefix applied', () => {
    logger.source('test')
      .info('message');

    expect(consoleLogSpy.getCall(0).args[1]).to.be.equal('[test]');
    expect(consoleLogSpy.getCall(0).args[2]).to.be.equal('message');
  });

  it('logs to the console with array args', () => {
    logger.info(['message1', 'message2']);
    expect(console.log).to.be.called;
  });

  describe('log criticality', () => {

    [
      'emergency',
      'alert',
      'critical',
      'error'
    ].forEach((logLevel: LogLevel) => {

      it(`will "console.error" for level [${logLevel}]`, () => {

        logger[logLevel](logLevel);

        expect(consoleErrorSpy.getCall(0).args[1]).to.be.equal(logLevel);
        expect(consoleLogSpy.called).to.be.false;
        expect(consoleWarnSpy.called).to.be.false;
      });

      [
        'warning',
        'notice'
      ].forEach((logLevel: LogLevel) => {

        it(`will "console.warn" for level [${logLevel}]`, () => {

          logger[logLevel](logLevel);

          expect(consoleWarnSpy.getCall(0).args[1]).to.be.equal(logLevel);
          expect(consoleLogSpy.called).to.be.false;
          expect(consoleErrorSpy.called).to.be.false;
        });
      });

      [
        'info',
        'debug'
      ].forEach((logLevel: LogLevel) => {

        it(`will "console.log" for level [${logLevel}]`, () => {

          logger[logLevel](logLevel);

          expect(consoleLogSpy.getCall(0).args[1]).to.be.equal(logLevel);
          expect(consoleWarnSpy.called).to.be.false;
          expect(consoleErrorSpy.called).to.be.false;

        });
      });

    });
  });

  describe('log verbosity levels', () => {
    it('logs all messages when the verbosity level is verbose', () => {

      process.env.LOG_LEVEL = 'verbose';
      const persistSpy = sinon.spy(logger, 'persistLog');

      [
        'emergency',
        'alert',
        'critical',
        'error',
        'warning',
        'notice',
        'info',
        'debug',
      ].forEach((level: LogLevel) => {
        logger[level](`${level} message`);

        expect(persistSpy.calledWith(level, [`${level} message`])).to.be.true;
      });

      persistSpy.restore();
    });

    it('logs no messages when the verbosity level is none', () => {
      process.env.LOG_LEVEL = 'none';
      const persistSpy = sinon.spy(logger, 'persistLog');

      [
        'emergency',
        'alert',
        'critical',
        'error',
        'warning',
        'notice',
        'info',
        'debug',
      ].forEach((level: LogLevel) => {
        logger[level](`${level} message`);

        expect(persistSpy.calledWith(level, [`${level} message`])).to.be.false;
      });

      persistSpy.restore();
    });

    it('logs info and above messages when the verbosity level is info', () => {
      process.env.LOG_LEVEL = 'info';
      const persistSpy = sinon.spy(logger, 'persistLog');

      logger.debug('debug message');
      expect(persistSpy.called).to.be.false;

      [
        'emergency',
        'alert',
        'critical',
        'error',
        'warning',
        'notice',
        'info',
      ].forEach((level: LogLevel) => {
        logger[level](`${level} message`);
        expect(persistSpy.calledWith(level, [`${level} message`])).to.be.true;
      });

      persistSpy.restore();
    });

    it('logs error and above messages when the verbosity level is error', () => {
      process.env.LOG_LEVEL = 'error';
      const persistSpy = sinon.spy(logger, 'persistLog');

      [
        'emergency',
        'alert',
        'critical',
        'error',
      ].forEach((level: LogLevel) => {
        logger[level](`${level} message`);
        expect(persistSpy.calledWith(level, [`${level} message`])).to.be.true;
      });

      persistSpy.reset();

      [
        'warning',
        'notice',
        'info'
      ].forEach((level: LogLevel) => {
        logger[level](`${level} message`);
        expect(persistSpy.calledWith(level, [`${level} message`])).to.be.false;
      });


      persistSpy.restore();
    });

    it('can override the verbosity level to verbose on an individual log so it does not log when level info', () => {
      process.env.LOG_LEVEL = 'info';
      const persistSpy = sinon.spy(logger, 'persistLog');

      logger.verbose.info('info');
      expect(persistSpy.called).to.be.false;

      logger.info('info');
      expect(persistSpy.called).to.be.true;
      persistSpy.restore();
    });
  });
});
