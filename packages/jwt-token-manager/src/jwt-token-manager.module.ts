import {JwtConfiguration} from './jwt-configuration';
import {KeyLoader, TokenManager} from './services';
import {TOKEN_MANAGER} from '@rxstack/security';
import {Module, ModuleWithProviders} from '@rxstack/core';

@Module()
export class JwtTokenManagerModule {
  static configure(configuration: JwtConfiguration): ModuleWithProviders {
    return {
      module: JwtTokenManagerModule,
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
