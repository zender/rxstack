import * as _ from 'lodash';
import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {User} from '@rxstack/kernel';
import {UserNotFoundException} from '../exceptions/index';

@Injectable()
export class InMemoryUserProvider<T extends User> implements UserProviderInterface {

  constructor(private readonly users: T[]) { }

  async loadUserByUsername(username: string): Promise<User> {
    const user = _.find<User>(this.users, {'username': username});
    if (!user) {
      throw new UserNotFoundException(username);
    }
    return user;
  }

  getUserProviderName(): string {
    return 'in-memory';
  }
}
