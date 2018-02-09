import {TokenExtractorInterface} from '../interfaces';
import {Injectable} from 'injection-js';
import {SecurityConfiguration} from '../security-configuration';
import {Request} from '@rxstack/kernel';

@Injectable()
export class QueryParameterTokenExtractor implements TokenExtractorInterface {

  constructor(private config: SecurityConfiguration) { }

  extract(request: Request): string {
    const name = this.config.token_extractors.query_parameter.name;
    if (request.params.has(name) && this.config.token_extractors.query_parameter.enabled) {
      return request.params.get(name);
    }
    return null;
  }

  getName(): string {
    return 'query_parameter';
  }
}