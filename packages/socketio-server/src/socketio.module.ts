import {Module, ModuleWithProviders} from '@rxstack/application';
import {SocketioServer} from './socketio.server';
import {SocketioServerConfiguration} from './socketio-server-configuration';

@Module()
export class SocketioModule {
  static configure(configuration: SocketioServerConfiguration): ModuleWithProviders {
    return {
      module: SocketioModule,
      providers: [
        { provide: SocketioServer, useClass: SocketioServer },
        {
          provide: SocketioServerConfiguration,
          useFactory: () => {
            return new SocketioServerConfiguration(configuration);
          },
          deps: []
        },
      ]
    };
  }
}