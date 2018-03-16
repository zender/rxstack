import {MockController} from './mock.controller';
import {Module} from '@rxstack/core';
import {MockEventListener} from './mock-event-listener';
import {SocketioModule} from '../../src/socketio.module';
import {environment} from '../environments/environment';
import {MockWithCustomNamespaceController} from './mock-with-custom-namespace.controller';

@Module({
  imports: [
    SocketioModule.configure(environment.socketio_server)
  ],
  providers: [
    { provide: MockController, useClass: MockController },
    { provide: MockWithCustomNamespaceController, useClass: MockWithCustomNamespaceController },
    { provide: MockEventListener, useClass: MockEventListener },
  ]
})
export class AppModule {}