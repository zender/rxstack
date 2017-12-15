import {ExpressServer} from './express.server';
import {Module, ProviderDefinition} from '@rxstack/application';
import {Configuration} from '@rxstack/configuration';

const PROVIDERS: ProviderDefinition[] = [
  { provide: ExpressServer, useClass: ExpressServer },
];

@Module({
  providers: PROVIDERS,
  configuration: (config: Configuration) => {
    config.register('express_server', {
      type: 'object',
      properties: {
        host: {
          required: true,
          type: 'string'
        },
        port: {
          required: true,
          type: 'integer'
        },
      }
    }, {
      'host': 'localhost',
      'port': 3000,
    });
  }
})
export class ExpressModule {}