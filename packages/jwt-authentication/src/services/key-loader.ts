import {JwtConfiguration, Rsa} from '../jwt-configuration';
import {Injectable} from 'injection-js';
import {readFile} from '../utils';

@Injectable()
export class KeyLoader {
  constructor(protected config: JwtConfiguration) {}

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