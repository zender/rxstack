import {Module, ModuleWithProviders} from '@rxstack/application';
import {FileUploadListener} from './file-upload.listener';
import {ExpressFileUploadConfiguration} from './express-file-upload-configuration';
const fs = require('fs');

const validate = (configuration: ExpressFileUploadConfiguration): void =>  {
  if (!fs.existsSync(configuration.directory))
    new Error('Directory does not exist');
};

@Module()
export class ExpressFileUploadModule {
  static configure(configuration: ExpressFileUploadConfiguration): ModuleWithProviders {
    return {
      module: ExpressFileUploadModule,
      providers: [
        {
          provide: ExpressFileUploadConfiguration,
          useFactory: () => {
            const configs = new ExpressFileUploadConfiguration(configuration);
            validate(configs);
            return configs;
          },
          deps: []
        },
        { provide: FileUploadListener, useClass: FileUploadListener },
      ]
    };
  }
}