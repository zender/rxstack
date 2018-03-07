import {Module} from '../../../src/application';
import {AnnotatedListener} from './annotated-listener';
import {AnnotatedController} from './annotated.controller';
import {NotAnnotatedController} from './not-annotated.controller';

@Module({
  providers: [
    { provide: AnnotatedController, useClass: AnnotatedController },
    { provide: NotAnnotatedController, useClass: NotAnnotatedController },
    { provide: AnnotatedListener, useClass: AnnotatedListener },
  ]
})
export class KernelModule { }