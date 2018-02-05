import {AuthenticationException, ProviderNotFoundException} from '../exceptions/index';
import {AuthenticationEvent} from '../events/authentication-event';
import {AuthenticationFailureEvent} from '../events/authentication-failure-event';
import {AuthenticationEvents} from '../authentication-events';
import {Injectable} from 'injection-js';
import {AuthenticationProviderInterface} from '../interfaces';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Token} from '@rxstack/kernel';

@Injectable()
export class AuthenticationProviderManager implements AuthenticationProviderInterface {

  private providers: Map<string, AuthenticationProviderInterface> = new Map();

  constructor(private eventDispatcher: AsyncEventDispatcher) { }

  register(name: string, provider: AuthenticationProviderInterface): void {
    if (this.providers.has(name)) {
      throw new Error(`Authentication provider ${name} already exists.`);
    }
    this.providers.set(name, provider);
  }

  async authenticate(token: Token): Promise<Token> {
    let lastException: AuthenticationException = null;
    let result: Token = null;
    const promises: Promise<Token>[] = [];

    this.providers.forEach((provider): void => {
      promises.push(provider.authenticate(token));
    });

    try {
      result = await Promise.all(promises).then((data: Token[]) => data.length > 0 ? data.pop() : null);
    } catch (e) {
      if (e instanceof AuthenticationException) {
        lastException = e;
      }
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
}