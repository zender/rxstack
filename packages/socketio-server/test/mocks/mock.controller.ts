import {Controller, Request, Response, Route, StreamableResponse} from '@rxstack/kernel';
import {NotFoundException} from '@rxstack/exceptions';
const assetsDir = process.mainModule['paths'][0].split('node_modules')[0].slice(0, -1) + '/test/assets';

@Controller('/mock')
export class MockController {

  @Route('GET', '/text', 'mock_text')
  async textAction(request: Request): Promise<Response> {
    return new Response(request.token);
  }

  @Route('GET', '/json', 'mock_json')
  async jsonAction(request: Request): Promise<Response> {
    return new Response({'id': 'json'});
  }

  @Route('GET', '/json', 'mock_null')
  async nullAction(request: Request): Promise<Response> {
    const response =  new Response();
    response.headers.set('content-type', 'text/plain');
    return response;
  }

  @Route('GET', '/exception', 'mock_exception')
  async exceptionAction(request: Request): Promise<Response> {
    if (parseInt(request.query.get('code')) === 404) {
      throw new NotFoundException();
    }
    throw new Error('something');
  }

  @Route('GET', '/stream', 'mock_stream')
  async streamAction(request: Request): Promise<StreamableResponse> {
    const path = assetsDir + '/video.mp4';
    return new StreamableResponse(path, request.headers.get('range'));
  }
}