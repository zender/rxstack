import {BootstrapModule, Module, ProviderDefinition} from '@rxstack/application';
import {environment} from '../environments/environment';
import {
  AUTH_PROVIDER_REGISTRY, PASSWORD_ENCODER_REGISTRY, SecurityModule,
  USER_PROVIDER_REGISTRY
} from '../../src/security.module';
import {MockService} from './mock.service';
import {PlainTextPasswordEncoder} from '../../src/password-encoders/plain-text.password-encoder';
import {InMemoryUserProvider} from '../../src/user-providers/in-memory-user-provider';
import {Noop2UserProvider} from './noop2-user-provider';
import {UserInterface} from '@rxstack/kernel';
import {TestUserWithEncoder} from './test-user-with-encoder';
import {TestAuthenticationProvider} from './test.authentication-provider';

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
      return new InMemoryUserProvider<UserInterface>(
        environment.user_providers.in_memory.users,
        (data: UserInterface) => new TestUserWithEncoder(data.username, data.password, data.roles)
      );
    },
    deps: [],
    multi: true
  },
  {
    provide: USER_PROVIDER_REGISTRY,
    useClass: Noop2UserProvider,
    multi: true
  },
  {
    provide: AUTH_PROVIDER_REGISTRY,
    useClass: TestAuthenticationProvider,
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
