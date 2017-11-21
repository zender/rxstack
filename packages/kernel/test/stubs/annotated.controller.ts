import {Controller, Route} from '../../src/metadata/decorators';
import {Response} from '../../src/models/response';
import {Request} from '../../src/models/request';
import {Injectable} from 'injection-js';

@Injectable()
@Controller({
  routeBase: 'annotated'
})
export class AnnotatedController {
  @Route('GET', '/')
  async indexAction(request: Request): Promise<Response> {
    return new Response('AnnotatedController::indexAction');
  }

  @Route('GET', '/exception')
  async exceptionAction(request: Request): Promise<Response> {
    throw new Error('Exception');
  }
}