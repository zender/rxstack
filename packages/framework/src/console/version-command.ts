import {Injectable} from 'injection-js';
import {AbstractCommand} from './abstract-command';
const exec = require('child_process').exec;

@Injectable()
export class VersionCommand extends AbstractCommand {
  static npm_command = 'npm list | grep @rxstack/framework';

  command = 'version';
  describe = 'Prints RXStack version this project uses.';

  async handler(argv: any) {
    const localNpmVersion = await VersionCommand.executeCommand(VersionCommand.npm_command);

    if (localNpmVersion) {
      console.log('Local installed version:', localNpmVersion.replace('@rxstack/framework', ''));
    } else {
      console.log('No local installed RxStack was found.');
    }
  }

  protected static executeCommand(command: string) {
    return new Promise<string>((ok) => {
      exec(command, (error: any, stdout: any) => {
        return stdout ? ok(stdout) : ok('');
      });
    });
  }
}