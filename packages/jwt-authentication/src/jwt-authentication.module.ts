import {Module, ModuleWithProviders} from '@rxstack/application';
import {JwtConfiguration} from './jwt-configuration';
import {KeyLoader, TokenManager} from './services';
import {TOKEN_MANAGER} from '@rxstack/security';

@Module()
export class JwtAuthenticationModule {
  static configure(configuration: JwtConfiguration): ModuleWithProviders {
    return {
      module: JwtAuthenticationModule,
      providers: [
        {
          provide: JwtConfiguration,
          useFactory: () => {
            return new JwtConfiguration(configuration);
          },
          deps: []
        },
        {
          provide: KeyLoader,
          useClass: KeyLoader
        },
        {
          provide: TOKEN_MANAGER,
          useClass: TokenManager
        },
      ],
    };
  }
}
