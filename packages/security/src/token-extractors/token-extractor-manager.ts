import {forwardRef, Inject, Injectable} from 'injection-js';
import {Request} from '@rxstack/kernel';
import {TOKEN_EXTRACTOR_REGISTRY} from '../security.module';
import {TokenExtractorInterface} from '../interfaces';

@Injectable()
export class TokenExtractorManager {

  private extractors: Map<string, TokenExtractorInterface> = new Map();

  constructor(@Inject(forwardRef(() => TOKEN_EXTRACTOR_REGISTRY)) registry: TokenExtractorInterface[]) {
    registry.forEach(extractor => this.extractors.set(extractor.getName(), extractor));
  }

  extract(request: Request): string {
    let token: string;
    this.extractors.forEach((extractor) => {
      if (token = extractor.extract(request)) {
        return;
      }
    });

    return token;
  }
}