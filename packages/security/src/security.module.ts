import {Module, ModuleWithProviders} from '@rxstack/application';
import {SecurityConfiguration} from './security-configuration';
import {InjectionToken} from 'injection-js';
import {
  AuthenticationProviderInterface, PasswordEncoderInterface, TokenExtractorInterface, TokenManagerInterface,
  UserProviderInterface
} from './interfaces';
import {BcryptPasswordEncoder} from './password-encoders/bcrypt.password-encoder';
import {EncoderFactory} from './password-encoders/encoder-factory';
import {UserProviderManager} from './user-providers/user-provider-manager';
import {NoopUserProvider} from './user-providers/noop-user-provider';
import {AuthenticationProviderManager} from './authentication/authentication-provider-manager';
import {UserPasswordAuthenticationProvider} from './authentication/user-password.authentication-provider';
import {TokenExtractorManager} from './token-extractors/token-extractor-manager';
import {QueryParameterTokenExtractor} from './token-extractors/query-parameter-token-extractor';
import {HeaderTokenExtractor} from './token-extractors/header-token-extractor';
import {TokenExtractorListener} from './event-listeners/token-extractor-listener';
import {AuthenticationTokenListener} from './event-listeners/authentication-token-listener';
import {InMemoryRefreshTokenManager} from './services/in-memory.refresh-token.manager';
import { BootstrapListener } from './event-listeners/bootstrap-listener';
import {SecurityController} from './controllers/security-controller';

export const AUTH_PROVIDER_REGISTRY = new InjectionToken<AuthenticationProviderInterface[]>('AUTH_PROVIDER_REGISTRY');
export const USER_PROVIDER_REGISTRY = new InjectionToken<UserProviderInterface[]>('USER_PROVIDER_REGISTRY');
export const PASSWORD_ENCODER_REGISTRY = new InjectionToken<PasswordEncoderInterface[]>('PASSWORD_ENCODER_REGISTRY');
export const TOKEN_EXTRACTOR_REGISTRY = new InjectionToken<TokenExtractorInterface[]>('TOKEN_EXTRACTOR_REGISTRY');
export const TOKEN_MANAGER = new InjectionToken<TokenManagerInterface>('TOKEN_MANAGER');
export const REFRESH_TOKEN_MANAGER = new InjectionToken<TokenManagerInterface>('REFRESH_TOKEN_MANAGER');

@Module()
export class SecurityModule {
  static configure(configuration: SecurityConfiguration): ModuleWithProviders {
    return {
      module: SecurityModule,
      providers: [
        {
          provide: SecurityConfiguration,
          useFactory: () => {
            return new SecurityConfiguration(configuration);
          },
          deps: []
        },
        {
          provide: EncoderFactory,
          useClass: EncoderFactory,
        },
        {
          provide: BootstrapListener,
          useClass: BootstrapListener,
        },
        {
          provide: SecurityController,
          useClass: SecurityController,
        },
        {
          provide: REFRESH_TOKEN_MANAGER,
          useFactory: (tokenManager: TokenManagerInterface) => {
            const ttl = (60 * 60 * 24);
            return new InMemoryRefreshTokenManager(tokenManager, ttl);
          },
          deps: [TOKEN_MANAGER]
        },
        {
          provide: PASSWORD_ENCODER_REGISTRY,
          useClass: BcryptPasswordEncoder,
          multi: true
        },
        {
          provide: UserProviderManager,
          useClass: UserProviderManager,
        },
        {
          provide: USER_PROVIDER_REGISTRY,
          useClass: NoopUserProvider,
          multi: true
        },
        {
          provide: AuthenticationProviderManager,
          useClass: AuthenticationProviderManager,
        },
        {
          provide: AUTH_PROVIDER_REGISTRY,
          useClass: UserPasswordAuthenticationProvider,
          multi: true
        },
        {
          provide: TokenExtractorManager,
          useClass: TokenExtractorManager,
        },
        {
          provide: TOKEN_EXTRACTOR_REGISTRY,
          useClass: QueryParameterTokenExtractor,
          multi: true
        },
        {
          provide: TOKEN_EXTRACTOR_REGISTRY,
          useClass: HeaderTokenExtractor,
          multi: true
        },
        {
          provide: TokenExtractorListener,
          useClass: TokenExtractorListener,
        },
        {
          provide: AuthenticationTokenListener,
          useClass: AuthenticationTokenListener,
        },
      ],
    };
  }
}
