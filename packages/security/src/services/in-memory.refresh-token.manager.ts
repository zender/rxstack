import {RefreshTokenInterface, RefreshTokenManagerInterface, TokenManagerInterface} from '../interfaces';
import {RefreshToken} from '../models/refresh-token';
import {Injectable} from 'injection-js';
import {UnauthorizedException} from '@rxstack/exceptions';
const md5 = require('crypto-js/md5');
const uuid = require('uuid/v4');

@Injectable()
export class InMemoryRefreshTokenManager implements RefreshTokenManagerInterface {

  private tokens: Map<string, RefreshTokenInterface> = new Map();

  constructor(private tokenManager: TokenManagerInterface,
              private ttl: number) {}

  async count(): Promise<number> {
    return Array.from(this.tokens.values()).filter((token) => token.isValid()).length;
  }

  async create(username: string, payload: Object): Promise<string> {
    const token = new RefreshToken(this.generate(), username, payload, this.ttl);
    this.tokens.set(token.token, token);
    return token.token;
  }

  async disable(refreshToken: string, username: string): Promise<void> {
    if (this.tokens.has(refreshToken)) {
      this.tokens.get(refreshToken).invalidate(username);
    }
  }

  async refresh(refreshToken: string, username: string): Promise<string> {
    if (!this.tokens.has(refreshToken)) {
      throw new UnauthorizedException();
    }
    const token = this.tokens.get(refreshToken);
    if (token.username !== username || !token.isValid()) {
      throw new UnauthorizedException();
    }
    return this.tokenManager.encode(token.payload);
  }

  async clear(): Promise<void> {
    this.tokens.clear();
  }

  private generate(): string {
    return md5(uuid()).toString();
  }
}