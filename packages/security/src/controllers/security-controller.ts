import {Inject, Injectable} from 'injection-js';
import {AuthenticationProviderManager} from '../authentication/authentication-provider-manager';
import {RefreshTokenManagerInterface, TokenManagerInterface} from '../interfaces';
import {TOKEN_MANAGER} from '../security.module';
import {Request, Response} from '@rxstack/kernel';
import {UsernameAndPasswordToken} from '../models/username-and-password.token';
import {ForbiddenException, MethodNotAllowedException, UnauthorizedException} from '@rxstack/exceptions';
import {Token} from '../models/token';

@Injectable()
export class SecurityController {
  constructor(protected authManager: AuthenticationProviderManager,
              @Inject(TOKEN_MANAGER) protected tokenManager: TokenManagerInterface,
              protected refreshTokenManager: RefreshTokenManagerInterface) { }

  async login(request: Request): Promise<Response> {
    const token = new UsernameAndPasswordToken(request.params.get('username'), request.params.get('password'));
    const authToken = await this.authManager.authenticate(token);
    const rawToken = await this.tokenManager.encode(authToken.getPayload());
    if (request.transport === 'SOCKET')
      request.connection['token'] = authToken;
    const refreshToken = await this.refreshTokenManager.create(authToken.getUsername(), authToken.getPayload());
    return new Response({rawToken, refreshToken});
  }

  async logout(request: Request): Promise<Response> {
    if (request.transport === 'SOCKET')
      request.connection['token'] = null;
    await this.refreshTokenManager.disable(request.params.get('refreshToken'), request.params.get('username'));
    return new Response(null, 204);
  }

  async refreshToken(request: Request): Promise<Response> {
    if (request.transport === 'SOCKET') {
      throw new MethodNotAllowedException('Action does not support sockets');
    }

    const token = this.refreshTokenManager
      .refresh(request.params.get('refreshToken'), request.params.get('username'));
    return new Response({'token': token});
  }

  async authenticate(request: Request): Promise<Response> {
    if (request.transport !== 'SOCKET') {
      throw new MethodNotAllowedException('Action supports only sockets');
    }

    if (request.token instanceof Token && request.token.isAuthenticated()) {
      throw new ForbiddenException('User is already authenticated.');
    }

    try {
      const token = new Token(request.params.get('token'));
      request.connection['token'] = await this.authManager.authenticate(token);
      return new Response(null, 204);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}