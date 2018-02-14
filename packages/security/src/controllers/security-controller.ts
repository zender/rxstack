import {forwardRef, Inject, Injectable} from 'injection-js';
import {AuthenticationProviderManager} from '../authentication/authentication-provider-manager';
import {RefreshTokenManagerInterface, TokenManagerInterface} from '../interfaces';
import {REFRESH_TOKEN_MANAGER, TOKEN_MANAGER} from '../security.module';
import {Request, Response} from '@rxstack/kernel';
import {UsernameAndPasswordToken} from '../models/username-and-password.token';
import {
  ForbiddenException, MethodNotAllowedException, NotFoundException,
  UnauthorizedException
} from '@rxstack/exceptions';
import {Token} from '../models/token';

@Injectable()
export class SecurityController {
  constructor(protected authManager: AuthenticationProviderManager,
              @Inject(forwardRef(() => TOKEN_MANAGER)) protected tokenManager: TokenManagerInterface,
              @Inject(forwardRef(() => REFRESH_TOKEN_MANAGER)) protected refreshTokenManager: RefreshTokenManagerInterface) { }

  async loginAction(request: Request): Promise<Response> {
    const token = new UsernameAndPasswordToken(request.params.get('username'), request.params.get('password'));
    const authToken = await this.authManager.authenticate(token);
    const rawToken = await this.tokenManager.encode(authToken.getPayload());
    if (request.transport === 'SOCKET')
      request.connection['token'] = authToken;
    const refreshToken = await this.refreshTokenManager.create(authToken);
    return new Response({'token': rawToken, 'refreshToken': refreshToken.toString()});
  }

  async logoutAction(request: Request): Promise<Response> {
    const refreshToken = await this.refreshTokenManager.get(request.params.get('refreshToken'));
    if (!refreshToken)
      throw new NotFoundException();
    await this.refreshTokenManager.disable(refreshToken);
    if (request.transport === 'SOCKET')
      request.connection['token'] = null;
    return new Response(null, 204);
  }

  async refreshTokenAction(request: Request): Promise<Response> {
    if (request.transport === 'SOCKET')
      throw new MethodNotAllowedException('Action does not support sockets');
    const refreshToken = await this.refreshTokenManager.get(request.params.get('refreshToken'));
    if (!refreshToken)
      throw new NotFoundException();
    const token = this.refreshTokenManager.refresh(refreshToken);
    return new Response({token});
  }

  async authenticateAction(request: Request): Promise<Response> {
    if (request.transport !== 'SOCKET')
      throw new MethodNotAllowedException('Action supports only sockets');

    if (request.token instanceof Token && request.token.isAuthenticated())
      throw new ForbiddenException('User is already authenticated.');

    try {
      const token = new Token(request.params.get('token'));
      request.connection['token'] = await this.authManager.authenticate(token);
      return new Response(null, 204);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}