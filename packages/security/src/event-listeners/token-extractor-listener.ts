import {Injectable} from 'injection-js';
import {TokenExtractorManager} from '../token-extractors/token-extractor-manager';
import {KernelEvents, RequestEvent} from '@rxstack/core';
import {Observe} from '@rxstack/async-event-dispatcher';
import {Token} from '../models/token';
import {AnonymousToken} from '../models/anonymous.token';

@Injectable()
export class TokenExtractorListener {

  constructor(private extractor: TokenExtractorManager) { }

  @Observe(KernelEvents.KERNEL_REQUEST, -150)
  async onRequest(event: RequestEvent): Promise<void> {
    const request = event.getRequest();
    let token = new AnonymousToken();
    if (request.transport === 'HTTP') {
      const rawToken = this.extractor.extract(request);
      if (rawToken)
        token = new Token(rawToken);
    } else if (request.transport === 'SOCKET') {
      request.connection['token'] ? token = request.connection['token'] : request.connection['token'] = token;
    }
    request.token = token;
  }
}