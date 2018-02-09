import {TokenManagerInterface} from '../../src/interfaces';
import {Injectable} from 'injection-js';

@Injectable()
export class TestTokenManager implements TokenManagerInterface {

  async encode(payload: Object): Promise<string> {
    return 'generated-token';
  }

  async decode(token: string): Promise<Object> {
    return {
      'key': 'value'
    };
  }
}