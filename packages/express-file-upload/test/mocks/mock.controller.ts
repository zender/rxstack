import {Controller, Request, Response, Route} from '@rxstack/kernel';

@Controller('/mock')
export class MockController {

  @Route('POST', '/upload', 'mock_upload')
  async uploadAction(request: Request): Promise<Response> {
    return new Response(request.files.get('file'));
  }

  @Route('GET', '/upload', 'mock_upload_dummy')
  async dummyAction(request: Request): Promise<Response> {
    return new Response('dummy');
  }
}