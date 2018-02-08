import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {User} from '@rxstack/kernel';
import {UserNotFoundException} from '../exceptions/index';

@Injectable()
export class NoopUserProvider implements UserProviderInterface {

  async loadUserByUsername(username: string): Promise<User> {
    throw new UserNotFoundException(username);
  }

  getUserProviderName(): string {
    return 'noop';
  }
}