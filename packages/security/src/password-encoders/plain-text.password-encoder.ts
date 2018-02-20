import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';

@Injectable()
export class PlainTextPasswordEncoder implements PasswordEncoderInterface {

  static readonly ENCODER_NAME = 'plain-text';

  constructor(private ignoreCase: boolean) {}

  async encodePassword(raw: string): Promise<string> {
    return raw;
  }

  async isPasswordValid(encoded: string, raw: string): Promise<boolean> {
    if (this.ignoreCase)
      return raw.toLowerCase() === encoded.toLowerCase();
    return raw === encoded;
  }

  getName(): string {
    return PlainTextPasswordEncoder.ENCODER_NAME;
  }
}