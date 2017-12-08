import {Response} from '../../src/models/response';
import {Request} from '../../src/models/request';

export class NotAnnotatedController {
  async indexAction(request: Request): Promise<Response> {
    return new Response('NotAnnotatedController::indexAction');
  }
}