import {BootstrapModule, Module, ModuleWithProviders} from '@rxstack/application';
import {SecurityModule} from '@rxstack/security';
import {JwtAuthenticationModule} from '../../src/jwt-authentication.module';

@Module()
export class AppModule {
  static options: any;
  static configure(): ModuleWithProviders {
    return {
      module: AppModule,
      imports: [
        BootstrapModule.configure(AppModule.options),
        SecurityModule.configure(AppModule.options.security),
        JwtAuthenticationModule.configure(AppModule.options.jwt_authentication)
      ],
      providers: []
    };
  }
}
