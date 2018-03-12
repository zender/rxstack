import {Module} from '../../../src/application';
import {AnnotatedListener} from './annotated-listener';
import {AnnotatedController} from './annotated.controller';

@Module({
  providers: [
    { provide: AnnotatedController, useClass: AnnotatedController },
    { provide: AnnotatedListener, useClass: AnnotatedListener },
  ]
})
export class KernelModule { }