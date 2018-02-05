import * as _ from 'lodash';
import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {User} from '@rxstack/kernel';
import {UserNotFoundException} from '../exceptions/index';
import {ServiceRegistry} from '@rxstack/service-registry';
import {UserProviderManager} from './user-provider-manager';

@Injectable()
@ServiceRegistry(UserProviderManager.userProviderNs, InMemoryUserProvider.userProviderName)
export class InMemoryUserProvider implements UserProviderInterface {

  static readonly userProviderName = 'security.in_memory_user_provider';

  constructor(public readonly users: User[]) { }

  async loadUserByUsername(username: string): Promise<User> {
    const user = _.find<User>(this.users, {'username': username});
    if (!user) {
      throw new UserNotFoundException(username);
    }
    return user;
  }
}