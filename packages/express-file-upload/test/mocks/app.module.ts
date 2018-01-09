import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '@rxstack/express-server';
import {ExpressFileUploadModule} from '../../src/express-file-upload.module';
import {MockServer} from './mock.server';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
  { provide: MockServer, useClass: MockServer },
];

@Module({
  imports: [ExpressModule, ExpressFileUploadModule],
  providers: APP_PROVIDERS
})
export class AppModule {}