import {AbstractServer} from '../application/src/abstract-server';
import * as express from 'express';
import * as http from 'http';
import {Application as ExpressApplication, Request as ExpressRequest, Response as ExpressResponse} from 'express';
import * as bodyParser from 'body-parser';
import {Kernel, Request, Response, RouteDefinition} from '@rxstack/kernel';
import {Exception} from '@rxstack/exceptions';
import {Injectable} from 'injection-js';

@Injectable()
export class ExpressServer extends AbstractServer {

  protected app: ExpressApplication;

  async startEngine(): Promise<this> {
    return new Promise((resolve, reject) => {
      this.httpServer.listen(this.port, this.host, resolve);
    }).then(() => this);
  }

  protected async configure(): Promise<this> {
    this.app = express();
    this.app.set('port', 300);
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.httpServer = http.createServer(<any>(this.app));

    // register routes
    this.injector.get(Kernel).getRouteDefinitions()
      .forEach(routeDefinition => this.registerRoute(routeDefinition));

    // dispatch CONFIGURE EVENT

    return this;
  }

  private async registerRoute(routeDefinition: RouteDefinition): Promise<void> {
    return this.app[routeDefinition.method.toLowerCase()](routeDefinition.path,
      async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
      const request = new Request('HTTP');
      request.path = routeDefinition.path;
      request.headers.fromObject(req.headers);
      request.query.fromObject(req.query);
      request.params.fromObject(req.params);
      request.body = req.body;

      return routeDefinition.handler(request)
        .then((response: Response) => {
          response.headers.forEach((value, key) => res.header(key, value));
          res.status(response.statusCode);
          res.send(response.content);
        }).catch(err => {
          let status = err.statusCode ? err.statusCode : 500;
          res.status(status).send(err);
        });
    });
  }
}