import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {SocketIOModule} from '../../src/socketio.module';
import {MockEventListener} from './mock-event-listener';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: MockEventListener, useClass: MockEventListener },
];

@Module({
  imports: [SocketIOModule],
  providers: APP_PROVIDERS
})
export class AppModule {}