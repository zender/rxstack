import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {UserNotFoundException} from '../exceptions/index';
import {UserInterface} from '@rxstack/kernel';

@Injectable()
export class NoopUserProvider implements UserProviderInterface {

  static readonly PROVIDER_NAME = 'noop';

  async loadUserByUsername(username: string): Promise<UserInterface> {
    throw new UserNotFoundException(username);
  }

  getName(): string {
    return NoopUserProvider.PROVIDER_NAME;
  }
}