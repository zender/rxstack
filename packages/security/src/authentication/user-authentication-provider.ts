import {Injectable} from 'injection-js';
import {BadCredentialsException} from '../exceptions/index';
import {EncoderFactory} from '../password-encoders/encoder-factory';
import {AuthenticationProviderInterface} from '../interfaces';
import {UserProviderManager} from '../user-providers/user-provider-manager';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Token, User} from '@rxstack/kernel';

@Injectable()
export class UserAuthenticationProvider implements AuthenticationProviderInterface {

  constructor(private userProvider: UserProviderManager,
              private dispatcher: AsyncEventDispatcher,
              private encoderFactory: EncoderFactory) {
  }

  async authenticate(token: Token): Promise<Token> {
    const user = await this.userProvider.loadUserByUsername(token.getUsername());
    // todo - why new???
    let authToken = new Token({'username': user.username, 'password': user.password}, user);
    this.checkAuthentication(user, authToken);
    authToken.isAuthenticated = true;
    return authToken;
  }

  protected checkAuthentication(user: User, token: Token): void {
    let presentedPassword = token.credentials.password;

    if ('' === presentedPassword) {
      throw new BadCredentialsException('The presented password cannot be empty.');
    }

    if (!this.encoderFactory.getEncoder(user).isPasswordValid(user.password, presentedPassword)) {
      throw new BadCredentialsException('The presented password is invalid.');
    }
  }
}