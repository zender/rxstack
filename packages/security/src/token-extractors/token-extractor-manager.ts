import {Injectable} from 'injection-js';
import {Request} from '@rxstack/core';
import {TokenExtractorInterface} from '../interfaces';

@Injectable()
export class TokenExtractorManager {

  private extractors: Map<string, TokenExtractorInterface> = new Map();

  constructor(registry: TokenExtractorInterface[]) {
    registry.forEach(extractor => this.extractors.set(extractor.getName(), extractor));
  }

  getByName(name: string): TokenExtractorInterface {
    return this.extractors.get(name);
  }

  extract(request: Request): string {
    let token: string;
    this.extractors.forEach((extractor) => {
      if (token) {
        return;
      }
      token = extractor.extract(request);
    });
    return token;
  }
}