import {Controller, Request, Response, Route, StreamableResponse} from '@rxstack/kernel';
import {NotFoundException} from '@rxstack/exceptions';

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
    return new Response(request.files.get('file'));
  }

  @Route('GET', '/download', 'mock_download')
  async downloadAction(request: Request): Promise<StreamableResponse> {
    const path =  process.env.APP_DIR + '/test/assets/video.mp4';
    const response = new StreamableResponse(path);
    response.headers.set('Content-Disposition', `attachment; filename="${response.name}"`);
    response.headers.set('Cache-Control', 'public, max-age=0');
    return response;
  }

  @Route('GET', '/stream', 'mock_stream')
  async streamAction(request: Request): Promise<StreamableResponse> {
    const path = process.env.APP_DIR + '/test/assets/video.mp4';
    return new StreamableResponse(path, request.headers.get('range'));
  }

  @Route('GET', '/exception', 'mock_exception')
  async exceptionAction(request: Request): Promise<StreamableResponse> {
    if (parseInt(request.params.get('code')) === 404) {
      throw new NotFoundException();
    }
    throw new Error('something');
  }
}