import {MockController} from './mock.controller';
import {Module, ProviderDefinition} from '@rxstack/application';
import {ExpressModule} from '@rxstack/express-server';
import {FileUploadListener} from '../../src/file-upload.listener';
import {ExpressFileUploadModule} from '../../src/express-file-upload.module';

export const APP_PROVIDERS: ProviderDefinition[] = [
  { provide: MockController, useClass: MockController },
];

@Module({
  imports: [ExpressModule, ExpressFileUploadModule],
  providers: APP_PROVIDERS
})
export class AppModule {}