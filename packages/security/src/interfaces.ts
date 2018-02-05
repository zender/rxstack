import {Token, User} from '@rxstack/kernel';

export interface AuthenticationProviderInterface {
  authenticate(token: Token): Promise<Token>;
}

export interface UserProviderInterface {
  loadUserByUsername(username: string, payload?: any): Promise<User>;
}

export interface PasswordEncoderInterface {
  encodePassword(raw: string, salt: string): Promise<string>;
  isPasswordValid(encoded: string, raw: string): Promise<boolean>;
}

export interface EncoderAwareInterface {
  getEncoderName(): string;
}