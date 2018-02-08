import {Injectable} from 'injection-js';
import {User} from '@rxstack/kernel';
import {UserProviderInterface} from '../../src/interfaces';
import {UserNotFoundException} from '../../src/exceptions/index';

@Injectable()
export class Noop2UserProvider implements UserProviderInterface {

  async loadUserByUsername(username: string): Promise<User> {
    throw new UserNotFoundException(username);
  }

  getUserProviderName(): string {
    return 'noop2';
  }
}