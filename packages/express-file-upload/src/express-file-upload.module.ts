import {Module, ProviderDefinition} from '@rxstack/application';
import {FileUploadListener} from './file-upload.listener';
import {Configuration} from '@rxstack/configuration';
const fs = require('fs');

const PROVIDERS: ProviderDefinition[] = [
  { provide: FileUploadListener, useClass: FileUploadListener },
];

@Module({
  providers: PROVIDERS,
  configuration: (config: Configuration) => {
    const schema =
      JSON.parse(fs.readFileSync(__dirname + '/configuration-schema.json', 'utf8'));
    const defaultConfigs =
      JSON.parse(fs.readFileSync(__dirname + '/default-configurations.json', 'utf8'));
    config.register('express_file_upload', schema, defaultConfigs);
  }
})
export class ExpressFileUploadModule {}