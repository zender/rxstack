import {Module} from '../../../src/application';
import {SocketListener} from './socket-listener';
import {TestServer} from './test.server';
import {SERVER_REGISTRY} from '../../../src/server';

@Module({
  providers: [
    { provide: SocketListener, useClass: SocketListener },
    { provide: SERVER_REGISTRY, useClass: TestServer, multi: true },
  ]
})
export class ServerModule { }