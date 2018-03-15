import {Module} from '../../../src/application';
import {SocketListener} from './socket-listener';

@Module({
  providers: [
    { provide: SocketListener, useClass: SocketListener },
  ]
})
export class ServerModule { }