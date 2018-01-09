import {Module} from '../../src/decorators';
import {MockController} from './mock.controller';
import {MockService} from './mock.service';
import {Configuration} from '@rxstack/configuration';
import {Test1Module} from './test1.module';
import {ProviderDefinition} from '../../src/interfaces';
import {MockServer} from './mock.server';
import {BootstrapListener} from './bootstrap-listener';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: BootstrapListener, useClass: BootstrapListener },
  { provide: MockServer, useClass: MockServer },
  { provide: MockController, useClass: MockController },
  { provide: MockService, useClass: MockService },
];

@Module({
  imports: [Test1Module],
  providers: APP_PROVIDERS,
  configuration: (config: Configuration) => {
    config.register('app', {
      type: 'object',
      properties: {
        name: {
          required: true,
          type: 'string'
        },
      }
    });
  }
})
export class AppModule {}