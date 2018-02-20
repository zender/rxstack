import {AuthenticationException, ProviderNotFoundException} from '../exceptions/index';
import {AuthenticationEvent} from '../events/authentication-event';
import {AuthenticationFailureEvent} from '../events/authentication-failure-event';
import {AuthenticationEvents} from '../authentication-events';
import {Injectable} from 'injection-js';
import {AuthenticationProviderInterface} from '../interfaces';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {TokenInterface} from '@rxstack/kernel';

@Injectable()
export class AuthenticationProviderManager {

  private providers: Map<string, AuthenticationProviderInterface> = new Map();

  constructor(registry: AuthenticationProviderInterface[], private eventDispatcher: AsyncEventDispatcher) {
    registry.forEach((provider) => this.providers.set(provider.getName(), provider));
  }

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    let lastException: AuthenticationException = null;
    let result: TokenInterface = null;
    const promises: Promise<TokenInterface>[] = [];

    this.providers.forEach((provider): void => {
      if (provider.support(token)) {
        promises.push(provider.authenticate(token));
      }
    });

    try {
      result = await Promise.all(promises).then((data: TokenInterface[]) => data.length > 0 ? data.pop() : null);
    } catch (e) {
      if (e instanceof AuthenticationException)
        lastException = e;
      else
        throw e;
    }

    if (null !== result) {
      const authenticationEvent = new AuthenticationEvent(result);
      await this.eventDispatcher.dispatch(AuthenticationEvents.AUTHENTICATION_SUCCESS, authenticationEvent);
      result = authenticationEvent.authenticationToken;
      return result;
    }

    if (null === lastException) {
      throw new ProviderNotFoundException();
    }

    const authenticationFailureEvent = new AuthenticationFailureEvent(token, lastException);
    await this.eventDispatcher
      .dispatch(AuthenticationEvents.AUTHENTICATION_FAILURE, authenticationFailureEvent);
    lastException.token = authenticationFailureEvent.authenticationToken;

    throw lastException;
  }

  getByName(name: string): AuthenticationProviderInterface {
    return this.providers.get(name);
  }
}