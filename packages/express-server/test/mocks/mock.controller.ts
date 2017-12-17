import {Controller, Request, Response, Route} from '@rxstack/kernel';

@Controller('/mock')
export class MockController {

  @Route('GET', '/text', 'mock_text')
  async textAction(): Promise<Response> {
    return new Response('something');
  }

  @Route('GET', '/json', 'mock_json')
  async jsonAction(request: Request): Promise<Response> {
    return new Response({'id': 'json'});
  }

  @Route('POST', '/upload', 'mock_upload')
  async uploadAction(request: Request): Promise<Response> {
    // console.log(request.body);
    console.log(request.files);
    return new Response();
  }
}