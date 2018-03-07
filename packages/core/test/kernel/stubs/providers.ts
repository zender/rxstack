import {Provider} from 'injection-js';
import {AnnotatedListener} from './annotated-listener';
import {AnnotatedController} from './annotated.controller';
import {NotAnnotatedController} from './not-annotated.controller';

export const STUB_PROVIDERS: Provider[] = [
  { provide: AnnotatedController, useClass: AnnotatedController },
  { provide: NotAnnotatedController, useClass: NotAnnotatedController },
  { provide: AnnotatedListener, useClass: AnnotatedListener },
];