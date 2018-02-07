import {Inject, Injectable} from 'injection-js';
import {PASSWORD_ENCODER_REGISTRY} from '../../src/security.module';
import {PasswordEncoderInterface} from '../../src/interfaces';

@Injectable()
export class MockService {
  constructor(@Inject(PASSWORD_ENCODER_REGISTRY) public registry: PasswordEncoderInterface[]) {}
}