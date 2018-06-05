import 'reflect-metadata';
import {VersionCommand} from '../../src/console';
const stdMocks = require('std-mocks');

describe('Console:VersionCommand', () => {
  it('should show package version', async () => {
    stdMocks.use();
    const v = new VersionCommand();
    await v.handler({});
    stdMocks.restore();
    const output = stdMocks.flush();
    const consoleOutput = output.stdout.pop();
    consoleOutput.includes('Local installed version').should.be.true;
  }).timeout(10000);

  it('should ...', async () => {
    stdMocks.use();
    const v = new VersionCommand();
    VersionCommand.npm_command = 'npm list | grep @rxstack/none';
    await v.handler({});
    stdMocks.restore();
    const output = stdMocks.flush();
    const consoleOutput = output.stdout.pop();
    consoleOutput.includes('No local installed RxStack was found').should.be.true;
  }).timeout(10000);
});