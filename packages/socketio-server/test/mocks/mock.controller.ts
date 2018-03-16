import {Request, Response, StreamableResponse} from '@rxstack/core';
import {NotFoundException} from '@rxstack/exceptions';
import {WebSocket} from '@rxstack/core';
const assetsDir = process.env.APP_DIR + '/test/assets';

export class MockController {

  @WebSocket('mock_json')
  async jsonAction(request: Request): Promise<Response> {
    return new Response({'id': 'json'});
  }

  @WebSocket('mock_null')
  async nullAction(request: Request): Promise<Response> {
    const response =  new Response();
    return response;
  }

  @WebSocket('mock_exception')
  async exceptionAction(request: Request): Promise<Response> {
    if (parseInt(request.params.get('code')) === 404) {
      throw new NotFoundException();
    }
    throw new Error('something');
  }

  @WebSocket('mock_stream')
  async streamAction(request: Request): Promise<StreamableResponse> {
    const path = assetsDir + '/video.mp4';
    return new StreamableResponse(path, request.headers.get('range'));
  }
}