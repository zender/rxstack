import {ExpressServer} from './express.server';
import {Module, ProviderDefinition} from '@rxstack/application';
import {Configuration} from '@rxstack/configuration';
const fs = require('fs');

const PROVIDERS: ProviderDefinition[] = [
  { provide: ExpressServer, useClass: ExpressServer },
];

@Module({
  providers: PROVIDERS,
  configuration: (config: Configuration) => {
    const schema =
      JSON.parse(fs.readFileSync(__dirname + '/configuration-schema.json', 'utf8'));
    const defaultConfigs =
      JSON.parse(fs.readFileSync(__dirname + '/default-configurations.json', 'utf8'));
    config.register('express_server', schema, defaultConfigs);
  }
})
export class ExpressModule {}