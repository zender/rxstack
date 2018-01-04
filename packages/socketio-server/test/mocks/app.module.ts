import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ConfiguratonListener} from './configuraton.listener';
import {SocketIOModule} from '../../src/socketio.module';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: ConfiguratonListener, useClass: ConfiguratonListener },
];

@Module({
  imports: [SocketIOModule],
  providers: APP_PROVIDERS
})
export class AppModule {}