import {Request, TokenInterface, UserInterface} from '@rxstack/core';

export type UserFactoryFunc<T extends UserInterface> = (data: UserInterface) => T;

export interface AuthenticationProviderInterface {
  authenticate(token: TokenInterface): Promise<TokenInterface>;
  getName(): string;
  support(token: TokenInterface): boolean;
}

export interface UserProviderInterface {
  loadUserByUsername(username: string, payload?: any): Promise<UserInterface>;
  getName(): string;
}

export interface PasswordEncoderInterface {
  encodePassword(raw: string): Promise<string>;
  isPasswordValid(encoded: string, raw: string): Promise<boolean>;
  getName(): string;
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
  invalidate(): void;
  toString(): string;
}

export interface RefreshTokenManagerInterface {
  count(): Promise<number>;
  create(authToken: TokenInterface): Promise<RefreshTokenInterface>;
  has(refreshToken: string): Promise<boolean>;
  get(refreshToken: string): Promise<RefreshTokenInterface>;
  disable(refreshToken: RefreshTokenInterface): Promise<void>;
  refresh(refreshToken: RefreshTokenInterface): Promise<string>;
  clear(): Promise<void>;
}

export interface TokenExtractorInterface {
  extract(request: Request): string;
  getName(): string;
}
