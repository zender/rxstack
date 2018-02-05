import {Module, ModuleWithProviders} from '@rxstack/application';

@Module()
export class SecurityModule {
  static configure(configuration: SecurityCo): ModuleWithProviders {
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