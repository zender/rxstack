import {Response} from '../../src/models/response';
import {Request} from '../../src/models/request';
import {Injectable} from 'injection-js';

@Injectable()
export class NoAnnotationController {
  async listAction(request: Request): Promise<Response> {
    const data = await this.getResponseData({'data': 'controller.list'});
    return new Response(data);
  }

  async getAction(request: Request): Promise<Response> {
    const data = await this.getResponseData({'data': 'controller.get'});
    return new Response(data);
  }

  private getResponseData(data: Object): Promise<Object> {
    return Promise.resolve(data);
  }
}