import {Module, ModuleWithProviders} from '@rxstack/core';
import {SecurityModule} from '../../src';

@Module()
export class AppJwtModule {
  static configure(options: any): ModuleWithProviders {
    return {
      module: AppJwtModule,
      imports: [
        SecurityModule.configure(options.security),
      ],
      providers: []
    };
  }
}
