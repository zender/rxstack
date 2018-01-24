import {ExpressServer} from './express.server';
import {Module, ModuleWithProviders} from '@rxstack/application';
import {ExpressServerConfiguration} from './express-server-configuration';

@Module()
export class ExpressModule {
  static configure(configuration: ExpressServerConfiguration): ModuleWithProviders {
    return {
      module: ExpressModule,
      providers: [
        {
          provide: ExpressServerConfiguration,
          useFactory: () => {
            return new ExpressServerConfiguration(configuration);
          },
          deps: []
        },
        { provide: ExpressServer, useClass: ExpressServer },
      ],
    };
  }
}