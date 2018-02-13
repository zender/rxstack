import {RefreshTokenInterface} from '../interfaces';
import {UnauthorizedException} from '@rxstack/exceptions';

export class RefreshToken implements RefreshTokenInterface {

  private validUntil: number;

  constructor(public token: string, public username: string, public payload: Object, ttl: number) {
    this.validUntil = new Date().getTime() + (ttl * 1000);
  }

  isValid(): boolean {
    return this.validUntil > new Date().getTime();
  }

  invalidate(username: string): void {
    if (this.username !== username) {
      throw new UnauthorizedException();
    }
    this.validUntil = 0;
  }
}