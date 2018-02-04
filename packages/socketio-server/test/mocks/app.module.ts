import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {MockEventListener} from './mock-event-listener';
import {SocketioModule} from '../../src/socketio.module';
import {environment} from '../environments/environment';
import {BootstrapModule} from '@rxstack/application';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: MockEventListener, useClass: MockEventListener },
];

@Module({
  imports: [
    BootstrapModule.configure(environment),
    SocketioModule.configure(environment.socketio_server)
  ],
  providers: APP_PROVIDERS
})
export class AppModule {}