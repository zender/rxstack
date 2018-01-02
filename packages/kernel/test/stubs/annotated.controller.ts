import {Controller, Route} from '../../src/metadata/decorators';
import {Response} from '../../src/models/response';
import {Request} from '../../src/models/request';
import {Injectable} from 'injection-js';

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