import {Module, ProviderDefinition} from '@rxstack/application';
import {Configuration} from '@rxstack/configuration';
import {SocketIOServer} from './socketio.server';
const fs = require('fs');

const PROVIDERS: ProviderDefinition[] = [
  { provide: SocketIOServer, useClass: SocketIOServer },
];

@Module({
  providers: PROVIDERS,
  configuration: (config: Configuration) => {
    const schema =
      JSON.parse(fs.readFileSync(__dirname + '/configuration-schema.json', 'utf8'));
    const defaultConfigs =
      JSON.parse(fs.readFileSync(__dirname + '/default-configurations.json', 'utf8'));
    config.register('socketio_server', schema, defaultConfigs);
  }
})
export class SocketIOModule {}