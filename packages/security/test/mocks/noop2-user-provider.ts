import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../../src/interfaces';
import {UserNotFoundException} from '../../src/exceptions/index';
import {UserInterface} from '@rxstack/kernel';

@Injectable()
export class Noop2UserProvider implements UserProviderInterface {

  async loadUserByUsername(username: string): Promise<UserInterface> {
    throw new UserNotFoundException(username);
  }

  getUserProviderName(): string {
    return 'noop2';
  }
}