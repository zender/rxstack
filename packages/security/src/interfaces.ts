import {Request, TokenInterface, UserInterface} from '@rxstack/kernel';

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

export interface TokenManagerInterface {
  encode(payload: Object): Promise<string>;
  decode(token: string): Promise<Object>;
}

export interface RefreshTokenInterface {
  token: string;
  username: string;
  payload: Object;
  isValid(): boolean;
  invalidate(username: string): void;
}

export interface RefreshTokenManagerInterface {
  count(): Promise<number>;
  create(username: string, payload: Object): Promise<string>;
  disable(refreshToken: string, username: string): Promise<void>;
  refresh(refreshToken: string, username: string): Promise<string>;
  clear(): Promise<void>;
}

export interface TokenExtractorInterface {
  extract(request: Request): string;
  getName(): string;
}
