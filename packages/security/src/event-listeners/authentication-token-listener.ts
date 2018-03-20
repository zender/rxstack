import {Injectable} from 'injection-js';
import {AuthenticationProviderManager} from '../authentication/authentication-provider-manager';
import {Observe} from '@rxstack/async-event-dispatcher';
import {KernelEvents, RequestEvent} from '@rxstack/core';
import {UnauthorizedException} from '@rxstack/exceptions';

@Injectable()
export class AuthenticationTokenListener {

  constructor(private authenticationManager: AuthenticationProviderManager) { }

  @Observe(KernelEvents.KERNEL_REQUEST, -100)
  async onRequest(event: RequestEvent): Promise<void> {
    const request = event.getRequest();
    if (request.token && false === request.token.isAuthenticated()) {
      try {
        request.token = await this.authenticationManager.authenticate(request.token);
      } catch (e) {
        throw new UnauthorizedException();
      }
    }
  }
}
