import {User} from '@rxstack/kernel';
import {EncoderAwareInterface} from '../../src/interfaces';

export class TestUserWithEncoder extends User implements EncoderAwareInterface {

  encoderName = 'plain-text';

  getEncoderName(): string {
    return this.encoderName;
  }
}