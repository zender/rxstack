import {Injectable} from 'injection-js';
import {BadCredentialsException} from '../exceptions/index';
import {EncoderFactory} from '../password-encoders/encoder-factory';
import {AuthenticationProviderInterface} from '../interfaces';
import {UserProviderManager} from '../user-providers/user-provider-manager';
import {TokenInterface, UserInterface} from '@rxstack/kernel';
import {UsernameAndPasswordToken} from '../models/username-and-password.token';

@Injectable()
export class UserAuthenticationProvider implements AuthenticationProviderInterface {

  constructor(private userProvider: UserProviderManager,
              private encoderFactory: EncoderFactory) {
  }

  async authenticate(token: TokenInterface): Promise<TokenInterface> {
    const user = await this.userProvider.loadUserByUsername(token.getUsername());
    this.checkAuthentication(user, token);
    token.setUser(user);
    token.setAuthenticated(true);
    return token;
  }

  getProviderName(): string {
    return 'user-password';
  }

  support(token: TokenInterface): boolean {
    if (token instanceof UsernameAndPasswordToken)
      return true;
    else
      return false;
  }

  protected checkAuthentication(user: UserInterface, token: TokenInterface): void {
    let presentedPassword = token.getCredentials();

    if ('' === presentedPassword) {
      throw new BadCredentialsException('The presented password cannot be empty.');
    }

    if (!this.encoderFactory.getEncoder(user).isPasswordValid(user.password, presentedPassword)) {
      throw new BadCredentialsException('The presented password is invalid.');
    }
  }
}