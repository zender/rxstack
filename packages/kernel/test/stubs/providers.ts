import {Provider} from 'injection-js';
import {NoAnnotationController} from './no-annotation.controller';
import {AnnotationController} from './annotation.controller';
import {AnnotatedListener} from './annotated-listener';

export const STUB_PROVIDERS: Provider[] = [
  { provide: AnnotationController, useClass: AnnotationController },
  { provide: NoAnnotationController, useClass: NoAnnotationController },
  { provide: AnnotatedListener, useClass: AnnotatedListener },
];