import {Request, Response} from '@rxstack/core';
import {WebSocket} from '@rxstack/core';

export class MockWithCustomNamespaceController {

  @WebSocket('mock_custom', '/custom')
  async jsonAction(request: Request): Promise<Response> {
    return new Response({'id': 'custom'});
  }
}