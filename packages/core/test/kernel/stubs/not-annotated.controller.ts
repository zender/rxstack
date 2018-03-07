import {Request, Response} from '../../../src/kernel/models';

export class NotAnnotatedController {
  async indexAction(request: Request): Promise<Response> {
    return new Response('NotAnnotatedController::indexAction');
  }
}