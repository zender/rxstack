import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {UserNotFoundException} from '../exceptions/index';
import {UserInterface} from '@rxstack/kernel';

@Injectable()
export class NoopUserProvider implements UserProviderInterface {

  async loadUserByUsername(username: string): Promise<UserInterface> {
    throw new UserNotFoundException(username);
  }

  getUserProviderName(): string {
    return 'noop';
  }
}