import {Controller, Response, Route} from '@rxstack/kernel';

@Controller('mock')
export class MockController {
  @Route('GET', '/index', 'mock_index')
  async indexAction(): Promise<Response> {
    return new Response('something');
  }
}