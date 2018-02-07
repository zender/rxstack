import {BootstrapModule, Module, ProviderDefinition} from '@rxstack/application';
import {environment} from '../environments/environment';
import {PASSWORD_ENCODER_REGISTRY, SecurityModule} from '../../src/security.module';
import {MockService} from './mock.service';
import {PlainTextPasswordEncoder} from '../../src/password-encoders/plain-text.password-encoder';

export const APP_PROVIDERS: ProviderDefinition[] = [
  {
    provide: MockService,
    useClass: MockService
  },
  {
    provide: PASSWORD_ENCODER_REGISTRY,
    useFactory: () => {
      return new PlainTextPasswordEncoder(true);
    },
    deps: [],
    multi: true
  },
];

@Module({
  imports: [
    BootstrapModule.configure(environment),
    SecurityModule.configure(environment.security)
  ],
  providers: APP_PROVIDERS
})
export class AppModule {}