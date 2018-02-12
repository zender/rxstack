import {Injectable} from 'injection-js';
import {TokenExtractorManager} from '../token-extractors/token-extractor-manager';
import {KernelEvents, RequestEvent} from '@rxstack/kernel';
import {Observe} from '@rxstack/async-event-dispatcher';
import {Token} from '../models/token';
import {AnonymousToken} from '../models/anonymous.token';

@Injectable()
export class TokenExtractorListener {

  constructor(private extractor: TokenExtractorManager) { }

  @Observe(KernelEvents.KERNEL_REQUEST, -150)
  async onRequest(event: RequestEvent): Promise<void> {
    const request = event.getRequest();
    const rawToken = this.extractor.extract(request);
    if (rawToken)
      request.token = new Token(rawToken);
    else
      request.token = new AnonymousToken();
  }
}