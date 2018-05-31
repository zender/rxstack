import {Injectable} from 'injection-js';
import {readFile} from '../utils';
import {Rsa, SecurityConfiguration} from '../security-configuration';

@Injectable()
export class KeyLoader {
  constructor(protected config: SecurityConfiguration) { }

  async loadPrivateKey(): Promise<Buffer|string> {
    if (this.config.secret instanceof Rsa) {
      return await readFile(this.config.secret.private_key);
    }
    return this.config.secret;
  }

  async loadPublicKey(): Promise<Buffer|string> {
    if (this.config.secret instanceof Rsa) {
      return await readFile(this.config.secret.public_key);
    }
    return this.config.secret;
  }
}