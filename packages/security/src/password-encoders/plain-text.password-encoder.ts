import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';

@Injectable()
export class PlainTextPasswordEncoder implements PasswordEncoderInterface {

  constructor(private ignoreCase: boolean) {}

  async encodePassword(raw: string): Promise<string> {
    return raw;
  }

  async isPasswordValid(encoded: string, raw: string): Promise<boolean> {
    if (this.ignoreCase) {
      return raw.toLowerCase() === encoded.toLowerCase();
    }
    return raw === encoded;
  }

  getEncoderName(): string {
    return 'plain-text';
  }
}