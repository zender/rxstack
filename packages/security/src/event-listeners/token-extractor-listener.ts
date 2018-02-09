import {Injectable} from 'injection-js';
import {TokenExtractorManager} from '../token-extractors/token-extractor-manager';
import {KernelEvents, RequestEvent} from '@rxstack/kernel';
import {JwtToken} from '../models/jwt.token';
import {Observe} from '@rxstack/async-event-dispatcher';

@Injectable()
export class TokenExtractorListener {

  constructor(private extractor: TokenExtractorManager) { }

  @Observe(KernelEvents.KERNEL_REQUEST, -150)
  async onRequest(event: RequestEvent): Promise<void> {
    const request = event.getRequest();
    const rawToken = this.extractor.extract(request);
    if (rawToken)
      request.token = new JwtToken(rawToken);
  }
}