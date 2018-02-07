import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';
const bcrypt = require('bcrypt');

@Injectable()
export class BcryptPasswordEncoder implements PasswordEncoderInterface {

  async encodePassword(raw: string): Promise<string> {
    return bcrypt.hash(raw, 10);
  }

  async isPasswordValid(encoded: string, raw: string): Promise<boolean> {
    return bcrypt.compare(raw, encoded);
  }

  getEncoderName(): string {
    return 'bcrypt';
  }
}