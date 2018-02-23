import {Injectable} from 'injection-js';
import {AuthenticationProviderManager} from '../authentication/authentication-provider-manager';
import {RefreshTokenInterface, RefreshTokenManagerInterface, TokenManagerInterface} from '../interfaces';
import {Request, Response, Transport} from '@rxstack/kernel';
import {UsernameAndPasswordToken} from '../models/username-and-password.token';
import {MethodNotAllowedException, NotFoundException, UnauthorizedException} from '@rxstack/exceptions';
import {Token} from '../models/token';
import {AnonymousToken} from '../models';

@Injectable()
export class SecurityController {
  constructor(protected authManager: AuthenticationProviderManager,
              protected tokenManager: TokenManagerInterface,
              protected refreshTokenManager: RefreshTokenManagerInterface) { }

  async loginAction(request: Request): Promise<Response> {
    this.throwMethodNotAllowed(request, 'SOCKET');
    const token = new UsernameAndPasswordToken(request.params.get('username'), request.params.get('password'));
    request.token = await this.authManager.authenticate(token);
    // dispatch ???
    const rawToken = await this.tokenManager.encode(request.token.getPayload());
    const refreshToken = await this.refreshTokenManager.create(request.token);
    return new Response({'token': rawToken, 'refreshToken': refreshToken.toString()});
  }

  async logoutAction(request: Request): Promise<Response> {
    request.connection['token'] = new AnonymousToken();
    try {
      const refreshToken = await this.findRefreshTokenOr404(request.params.get('refreshToken'));
      await this.refreshTokenManager.disable(refreshToken);
      // dispatch ???
    } catch (e) { }

    return new Response(null, 204);
  }

  async refreshTokenAction(request: Request): Promise<Response> {
    this.throwMethodNotAllowed(request, 'SOCKET');
    const refreshToken = await this.findRefreshTokenOr404(request.params.get('refreshToken'));
    const token = await this.refreshTokenManager.refresh(refreshToken);
    // dispatch ???
    return new Response({token});
  }

  async authenticateAction(request: Request): Promise<Response> {
    this.throwMethodNotAllowed(request, 'HTTP');
    try {
      const token = new Token(request.params.get('bearer'));
      request.connection['token'] = await this.authManager.authenticate(token);
      request.token = request.connection['token'];
      // dispatch ???
      return new Response(null, 204);
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  private async findRefreshTokenOr404(token: string): Promise<RefreshTokenInterface> {
    const refreshToken = await this.refreshTokenManager.get(token);
    if (!refreshToken)
      throw new NotFoundException();
    return refreshToken;
  }

  private throwMethodNotAllowed(request: Request, transport: Transport): void {
    if (request.transport === transport)
      throw new MethodNotAllowedException('Socket connection is not allowed.');
  }
}