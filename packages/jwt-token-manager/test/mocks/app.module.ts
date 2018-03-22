import {Module, ModuleWithProviders} from '@rxstack/core';
import {SecurityModule} from '@rxstack/security';
import {JwtTokenManagerModule} from '../../src/jwt-token-manager.module';

@Module()
export class AppModule {
  static configure(options: any): ModuleWithProviders {
    return {
      module: AppModule,
      imports: [
        SecurityModule.configure(options.security),
        JwtTokenManagerModule.configure(options.jwt_token_manager)
      ],
      providers: []
    };
  }
}
