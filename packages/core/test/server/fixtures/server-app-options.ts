import {ApplicationOptions} from '../../../src/application';
import {application_environment} from '../../environments/application_environment';
import {SocketListener} from './socket-listener';

export const SERVER_APP_OPTIONS: ApplicationOptions = {
  providers: [
    { provide: SocketListener, useClass: SocketListener }
  ],
  servers: application_environment.servers,
  logger: application_environment.logger
};