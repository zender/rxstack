import {TokenInterface, UserInterface} from '@rxstack/kernel';

export type UserFactoryFunc<T extends UserInterface> = (data: UserInterface) => T;

export interface AuthenticationProviderInterface {
  authenticate(token: TokenInterface): Promise<TokenInterface>;
  getProviderName(): string;
  support(token: TokenInterface): boolean;
}

export interface UserProviderInterface {
  loadUserByUsername(username: string, payload?: any): Promise<UserInterface>;
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