import {Module, ModuleWithProviders} from '@rxstack/application';
import {SecurityConfiguration} from './security-configuration';
import {InjectionToken} from 'injection-js';
import {AuthenticationProviderInterface, PasswordEncoderInterface, UserProviderInterface} from './interfaces';
import {BcryptPasswordEncoder} from './password-encoders/bcrypt.password-encoder';
import {EncoderFactory} from './password-encoders/encoder-factory';
import {UserProviderManager} from './user-providers/user-provider-manager';
import {NoopUserProvider} from './user-providers/noop-user-provider';

export const AUTH_PROVIDER_REGISTRY = new InjectionToken<AuthenticationProviderInterface[]>('AUTH_PROVIDER_REGISTRY');
export const USER_PROVIDER_REGISTRY = new InjectionToken<UserProviderInterface[]>('USER_PROVIDER_REGISTRY');
export const PASSWORD_ENCODER_REGISTRY = new InjectionToken<PasswordEncoderInterface[]>('PASSWORD_ENCODER_REGISTRY');

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
      ],
    };
  }
}