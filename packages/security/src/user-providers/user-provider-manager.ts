import {Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {User} from '@rxstack/kernel';
import {UserNotFoundException} from '../exceptions/index';

@Injectable()
export class UserProviderManager implements UserProviderInterface {

  static readonly userProviderNs = 'rxstack_user_provider';

  private providers: Map<string, UserProviderInterface> = new Map();

  register(name: string, provider: UserProviderInterface): void {
    if (this.providers.has(name)) {
      throw new Error(`Provider ${name} already exists.`);
    }
    this.providers.set(name, provider);
  }

  async loadUserByUsername(username: string, payload?: any): Promise<User> {
    let user = await this.findUser(username, payload);
    if (!user) {
      throw new UserNotFoundException(username);
    }
    return user;
  }

  private async findUser(username: string, payload?: Object): Promise<User> {
    return Array.from(this.providers.values()).reduce((current: Promise<User>, provider): Promise<User> => {
      return current.then(async (data: User) => {
        if (data) {
          return data;
        }

        try {
          return await provider.loadUserByUsername(username, payload);
        } catch (e) { }
      });
    }, Promise.resolve(null));
  }
}