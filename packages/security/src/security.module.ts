import {Module, ModuleWithProviders} from '@rxstack/application';
import {SecurityConfiguration} from './security-configuration';
import {InjectionToken} from 'injection-js';
import {
  AuthenticationProviderInterface, PasswordEncoderInterface, RefreshTokenManagerInterface, TokenExtractorInterface,
  TokenManagerInterface,
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
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {TokenAuthenticationProvider} from './authentication/token.authentication-provider';

export const AUTH_PROVIDER_REGISTRY = new InjectionToken<AuthenticationProviderInterface[]>('AUTH_PROVIDER_REGISTRY');
export const USER_PROVIDER_REGISTRY = new InjectionToken<UserProviderInterface[]>('USER_PROVIDER_REGISTRY');
export const PASSWORD_ENCODER_REGISTRY = new InjectionToken<PasswordEncoderInterface[]>('PASSWORD_ENCODER_REGISTRY');
export const TOKEN_EXTRACTOR_REGISTRY = new InjectionToken<TokenExtractorInterface[]>('TOKEN_EXTRACTOR_REGISTRY');
export const TOKEN_MANAGER = new InjectionToken<TokenManagerInterface>('TOKEN_MANAGER');
export const REFRESH_TOKEN_MANAGER = new InjectionToken<RefreshTokenManagerInterface>('REFRESH_TOKEN_MANAGER');

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
          useFactory: (registry: PasswordEncoderInterface[]) => {
            return new EncoderFactory(registry);
          },
          deps: [PASSWORD_ENCODER_REGISTRY]
        },
        {
          provide: BootstrapListener,
          useClass: BootstrapListener,
        },
        {
          provide: SecurityController,
          useFactory: (authManager: AuthenticationProviderManager,
                       tokenManager: TokenManagerInterface,
                       refreshTokenManager: RefreshTokenManagerInterface,
                       dispatcher: AsyncEventDispatcher
          ) => {
            return new SecurityController(authManager, tokenManager, refreshTokenManager, dispatcher);
          },
          deps: [AuthenticationProviderManager, TOKEN_MANAGER, REFRESH_TOKEN_MANAGER, AsyncEventDispatcher]
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
          useFactory: (registry: UserProviderInterface[]) => {
            return new UserProviderManager(registry);
          },
          deps: [USER_PROVIDER_REGISTRY]
        },
        {
          provide: USER_PROVIDER_REGISTRY,
          useClass: NoopUserProvider,
          multi: true
        },
        {
          provide: AuthenticationProviderManager,
          useFactory: (registry: AuthenticationProviderInterface[],
                       eventDispatcher: AsyncEventDispatcher) => {
            return new AuthenticationProviderManager(registry, eventDispatcher);
          },
          deps: [AUTH_PROVIDER_REGISTRY, AsyncEventDispatcher]
        },
        {
          provide: AUTH_PROVIDER_REGISTRY,
          useFactory: (userProvider: UserProviderManager,
                       tokenManager: TokenManagerInterface,
                       config: SecurityConfiguration) => {
            return new TokenAuthenticationProvider(userProvider, tokenManager, config);
          },
          deps: [UserProviderManager, TOKEN_MANAGER, SecurityConfiguration],
          multi: true
        },
        {
          provide: AUTH_PROVIDER_REGISTRY,
          useClass: UserPasswordAuthenticationProvider,
          multi: true
        },
        {
          provide: TokenExtractorManager,
          useFactory: (registry: TokenExtractorInterface[]) => {
            return new TokenExtractorManager(registry);
          },
          deps: [TOKEN_EXTRACTOR_REGISTRY]
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
