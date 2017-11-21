import {Controller, Route} from '../../src/metadata/decorators';
import {Response} from '../../src/models/response';
import {Request} from '../../src/models/request';
import {Injectable} from 'injection-js';

@Injectable()
@Controller({
  routeBase: 'annotation'
})
export class AnnotationController {
  @Route('GET', '/')
  async listAction(request: Request): Promise<Response> {
    const data = await this.getResponseData({'data': 'AnnotationController.listAction'});
    return new Response(data);
  }

  @Route('GET', '/:id')
  async getAction(request: Request): Promise<Response> {
    const data = await this.getResponseData({'data': 'AnnotationController.getAction'});
    return new Response(data);
  }


  @Route('GET', '/exception')
  async exceptionAction(request: Request): Promise<Response> {
    throw new Error('Exception');
  }

  private getResponseData(data: Object): Promise<Object> {
    return Promise.resolve(data);
  }
}