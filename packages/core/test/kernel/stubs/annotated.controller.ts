import {Injectable} from 'injection-js';
import {Controller, Route} from '../../../src/kernel/metadata';
import {Request, Response} from '../../../src/kernel/models';

@Injectable()
@Controller('/annotated')
export class AnnotatedController {
  @Route('GET', '/', 'annotated_index')
  async indexAction(request: Request): Promise<Response> {
    return new Response('AnnotatedController::indexAction');
  }

  @Route('GET', '/exception', 'annotated_exception')
  async exceptionAction(request: Request): Promise<Response> {
    throw new Error('Exception');
  }
}