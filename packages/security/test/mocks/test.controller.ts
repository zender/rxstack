import {Request, Response, ResponseObject} from '@rxstack/kernel';
import {Injectable} from 'injection-js';
import {UnauthorizedException} from '@rxstack/exceptions';

@Injectable()
export class TestController {
  async indexAction(request: Request): Promise<ResponseObject> {
    if (!request.token.hasRole('ADMIN')) {
      throw new UnauthorizedException();
    }
    return new Response(request.token.getUsername());
  }

  async anonAction(request: Request): Promise<ResponseObject> {
    return new Response({
      username: request.token.getUsername(),
      credentials: request.token.getCredentials()
    });
  }
}