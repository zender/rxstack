import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';
import {ServiceRegistry} from '@rxstack/service-registry';
import {EncoderFactory} from './encoder-factory';
const bcrypt = require('bcrypt');

@Injectable()
@ServiceRegistry(EncoderFactory.encoderNs, BcryptPasswordEncoder.encoderName)
export class BcryptPasswordEncoder implements PasswordEncoderInterface {

  static readonly encoderName = 'security.encoder.bcrypt';

  async encodePassword(raw: string): Promise<string> {
    return bcrypt.hash(raw, 10);
  }

  async isPasswordValid(encoded: string, raw: string): Promise<boolean> {
    return bcrypt.compare(raw, encoded);
  }
}