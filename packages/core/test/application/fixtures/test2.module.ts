import {Module} from '../../../src/application/decorators';
import {Service3} from './service3';

@Module({
  providers: [
    { provide: Service3, useClass: Service3 },
  ],
})
export class Test2Module {}