import {BootstrapModule, Module, ProviderDefinition} from '@rxstack/application';
import {environment} from '../environments/environment';
import {PASSWORD_ENCODER_REGISTRY, SecurityModule, USER_PROVIDER_REGISTRY} from '../../src/security.module';
import {MockService} from './mock.service';
import {PlainTextPasswordEncoder} from '../../src/password-encoders/plain-text.password-encoder';
import {InMemoryUserProvider} from '../../src/user-providers/in-memory-user-provider';
import {Noop2UserProvider} from './noop2-user-provider';
import {User} from '@rxstack/kernel';

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
  {
    provide: USER_PROVIDER_REGISTRY,
    useFactory: () => {
      return new InMemoryUserProvider<User>(environment.user_providers.in_memory.users);
    },
    deps: [],
    multi: true
  },
  {
    provide: USER_PROVIDER_REGISTRY,
    useClass: Noop2UserProvider,
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
