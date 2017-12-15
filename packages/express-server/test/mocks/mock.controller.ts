import {Controller, Response, Route} from '@rxstack/kernel';

@Controller('/mock')
export class MockController {

  @Route('GET', '/text', 'mock_text')
  async textAction(): Promise<Response> {
    return new Response('something');
  }

  @Route('GET', '/json', 'mock_json')
  async jsonAction(): Promise<Response> {
    return new Response({'id': 'json'});
  }
}