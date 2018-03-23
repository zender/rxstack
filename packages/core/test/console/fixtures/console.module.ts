import {Module} from '../../../src/application';
import {COMMAND_REGISTRY} from '../../../src/console';
import {TestCommand} from './test-command';

@Module({
  providers: [
    { provide: COMMAND_REGISTRY, useClass: TestCommand, multi: true },
  ]
})
export class ConsoleModule { }