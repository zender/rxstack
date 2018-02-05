import {Injectable} from 'injection-js';
import {User} from '@rxstack/kernel';
import {PasswordEncoderInterface} from '../interfaces';

@Injectable()
export class EncoderFactory {

  static readonly encoderNs = 'rxstack_password_encoder';
  static readonly defaultEncoder = 'security.encoder.bcrypt';

  private encoders: Map<string, PasswordEncoderInterface> = new Map();

  register(name: string, encoder: PasswordEncoderInterface) {
    if (this.encoders.has(name)) {
      throw new Error(`Encoder ${name} already exists.`);
    }
    this.encoders.set(name, encoder);
  }

  getEncoder(user: User): PasswordEncoderInterface {
    if (typeof user['geEncoderName'] === 'function') {
      const encoderName = user['getEncoderName']();
      const encoder: PasswordEncoderInterface = this.encoders.get(encoderName);
      if (!encoder) {
        throw new Error(`Encoder ${encoderName} does not exist.`);
      }
      return encoder;
    }
    return this.encoders.get(EncoderFactory.defaultEncoder);
  }
}