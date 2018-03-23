import 'reflect-metadata';
const yargs = require('yargs');
import {Application} from '../../src/application';
import {application_environment} from '../environments/application_environment';
import {ConsoleModule} from './fixtures/console.module';
import {CommandManager} from '../../src/console';
const stdMocks = require('std-mocks');

describe('CommandManager', () => {
  // Setup application
  yargs(['testing']).option('s', {
    type: 'string',
    default: 'hello'
  });
  const app = new Application(ConsoleModule, application_environment);

  it('should register and execute testing command', async () => {
    stdMocks.use();
    await app.start(true);
    stdMocks.restore();
    const output = stdMocks.flush();
    const consoleOutput = output.stdout.pop();
    consoleOutput.includes('hello').should.be.true;
    app.getInjector().get(CommandManager).commands.length.should.be.equal(2);
    app.stop();
  });

});