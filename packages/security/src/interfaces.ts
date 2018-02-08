import {Token, User} from '@rxstack/kernel';

export interface AuthenticationProviderInterface {
  authenticate(token: Token): Promise<Token>;
}

export interface UserProviderInterface {
  loadUserByUsername(username: string, payload?: any): Promise<User>;
  getUserProviderName(): string;
}

export interface PasswordEncoderInterface {
  encodePassword(raw: string): Promise<string>;
  isPasswordValid(encoded: string, raw: string): Promise<boolean>;
  getEncoderName(): string;
}

export interface EncoderAwareInterface {
  getEncoderName(): string;
}