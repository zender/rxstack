import {TokenManagerInterface} from '../interfaces';
import {NotImplementedException} from '@rxstack/exceptions';

export class NoopTokenManager implements TokenManagerInterface {

  async encode(payload: Object): Promise<string> {
    throw new NotImplementedException();
  }

  async decode(token: string): Promise<Object> {
    throw new NotImplementedException();
  }
}