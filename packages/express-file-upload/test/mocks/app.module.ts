import {MockController} from './mock.controller';
import {Module, ModuleWithProviders, SERVER_REGISTRY} from '@rxstack/core';
import {ExpressModule} from '@rxstack/express-server';
import {ExpressFileUploadModule} from '../../src/express-file-upload.module';
import {MockServer} from './mock.server';

@Module()
export class AppModule {
  static configure(options: any): ModuleWithProviders {
    return {
      module: AppModule,
      imports: [
        ExpressModule.configure(options.express_server),
        ExpressFileUploadModule.configure(options.express_file_upload)
      ],
      providers: [
        { provide: MockController, useClass: MockController },
        { provide: SERVER_REGISTRY, useClass: MockServer, multi: true },
      ]
    };
  }
}