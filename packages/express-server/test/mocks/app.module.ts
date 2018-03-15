import {MockController} from './mock.controller';
import {ExpressModule} from '../../src/express.module';
import {ConfigurationListener} from './configuration.listener';
import {Module} from '@rxstack/core';
import {express_server_environment} from '../environments/express_server_environment';

@Module({
  imports: [
    ExpressModule.configure(express_server_environment.express_server)
  ],
  providers: [
    { provide: MockController, useClass: MockController },
    { provide: ConfigurationListener, useClass: ConfigurationListener },
  ]
})
export class AppModule {}