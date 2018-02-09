import {forwardRef, Inject, Injectable} from 'injection-js';
import {UserProviderInterface} from '../interfaces';
import {UserInterface} from '@rxstack/kernel';
import {UserNotFoundException} from '../exceptions/index';
import {USER_PROVIDER_REGISTRY} from '../security.module';

@Injectable()
export class UserProviderManager {

  private providers: Map<string, UserProviderInterface> = new Map();

  constructor(@Inject(forwardRef(() => USER_PROVIDER_REGISTRY)) registry: UserProviderInterface[]) {
    registry.forEach((provider) => this.providers.set(provider.getUserProviderName(), provider));
  }

  getProviderByName(name: string): UserProviderInterface {
    return this.providers.get(name);
  }

  async loadUserByUsername(username: string, payload?: any): Promise<UserInterface> {
    const user: UserInterface = await this.findUser(username, payload);
    if (!user)
      throw new UserNotFoundException(username);
    else
      return user;
  }

  private async findUser(username: string, payload?: Object): Promise<UserInterface> {
    return Array.from(this.providers.values()).reduce((current: Promise<UserInterface>, provider): Promise<UserInterface> => {
      return current.then(async (user: UserInterface) => {
        if (user)
          return user;
        try {
          return await provider.loadUserByUsername(username, payload);
        } catch (e) {
          return null;
        }
      });
    }, Promise.resolve(null));
  }
}