import {Injectable} from 'injection-js';
import {PasswordEncoderInterface} from '../interfaces';
import {User} from '../models/user';

@Injectable()
export class EncoderFactory {

  static readonly defaultEncoder = 'bcrypt';

  private encoders: Map<string, PasswordEncoderInterface> = new Map();

  constructor(registry: PasswordEncoderInterface[]) {
    registry.forEach((encoder) => this.encoders.set(encoder.getName(), encoder));
  }

  getByName(name: string): PasswordEncoderInterface {
    return this.encoders.get(name);
  }

  getEncoder(user: User): PasswordEncoderInterface {
    if (typeof user['getEncoderName'] === 'function') {
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