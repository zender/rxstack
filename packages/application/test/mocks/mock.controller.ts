import {Controller, Response, Route} from '@rxstack/kernel';
import {Inject, Injectable} from 'injection-js';

@Injectable()
@Controller('mock')
export class MockController {
  constructor() {}
  @Route('GET', '/index', 'mock_index')
  async indexAction(): Promise<Response> {
    return new Response('something');
  }
}