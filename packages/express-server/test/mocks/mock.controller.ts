import {Http, Request, Response, StreamableResponse} from '@rxstack/core';
import {NotFoundException} from '@rxstack/exceptions';

export class MockController {

  @Http('GET', '/mock/text', 'mock_text')
  async textAction(): Promise<Response> {
    return new Response('something');
  }

  @Http('GET', '/mock/json', 'mock_json')
  async jsonAction(request: Request): Promise<Response> {
    return new Response({'id': 'json'});
  }

  @Http('POST', '/mock/upload', 'mock_upload')
  async uploadAction(request: Request): Promise<Response> {
    return new Response(request.files.get('file'));
  }

  @Http('GET', '/mock/download', 'mock_download')
  async downloadAction(request: Request): Promise<StreamableResponse> {
    const path =  process.env.APP_DIR + '/test/assets/video.mp4';
    const response = new StreamableResponse(path);
    response.headers.set('Content-Disposition', `attachment; filename="${response.name}"`);
    response.headers.set('Cache-Control', 'public, max-age=0');
    return response;
  }

  @Http('GET', '/mock/stream', 'mock_stream')
  async streamAction(request: Request): Promise<StreamableResponse> {
    const path = process.env.APP_DIR + '/test/assets/video.mp4';
    return new StreamableResponse(path, request.headers.get('range'));
  }

  @Http('GET', '/mock/exception', 'mock_exception')
  async exceptionAction(request: Request): Promise<StreamableResponse> {
    if (parseInt(request.params.get('code')) === 404) {
      throw new NotFoundException();
    }
    throw new Error('something');
  }
}