import * as express from 'express';
import * as http from 'http';
import {
  NextFunction, Request as ExpressRequest, RequestHandler,
  Response as ExpressResponse
} from 'express';
import * as bodyParser from 'body-parser';
import {Request, ResponseObject, RouteDefinition, StreamableResponse} from '@rxstack/kernel';
import {AbstractServer, ServerConfigurationEvent, ServerManager, ServerEvents} from '@rxstack/server-commons';
import * as compress from 'compression';
import * as cors from 'cors';
import {ServiceRegistry} from '@rxstack/service-registry';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {Configuration} from '@rxstack/configuration';
const formidable = require('formidable');
const fs = require('fs');

@ServiceRegistry(ServerManager.ns, ExpressServer.serverName)
export class ExpressServer extends AbstractServer {

  static serverName = 'server.express';

  protected async configure(routeDefinition: RouteDefinition[]): Promise<void> {
    const configuration = this.injector.get(Configuration);
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    this.host = configuration.get('express_server.host');
    this.port = configuration.get('express_server.port');

    this.engine = express();
    this.engine.options('*', cors());
    this.engine.use(cors());
    this.engine.use(compress());
    this.engine.use(bodyParser.json());
    this.engine.use(bodyParser.urlencoded({ extended: true }));
    this.engine.use(this.uploadHandler(configuration));

    await dispatcher
      .dispatch(ServerEvents.CONFIGURE, new ServerConfigurationEvent(this.engine, ExpressServer.serverName));
    // register routes
    routeDefinition.forEach(routeDefinition => this.registerRoute(routeDefinition));
    this.httpServer = http.createServer(<any>(this.engine));
  }

  private createRequest(req: ExpressRequest, routeDefinition: RouteDefinition): Request {
    const request = new Request('HTTP');
    request.path = routeDefinition.path;
    request.headers.fromObject(req.headers);
    request.params.fromObject(Object.assign({}, req.query, req.params));
    request.files.fromObject(req['files'] || {});
    request.body = req.body;

    return request;
  }

  private async registerRoute(routeDefinition: RouteDefinition): Promise<void> {
    return this.engine[routeDefinition.method.toLowerCase()](routeDefinition.path,
      async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
        return routeDefinition.handler(this.createRequest(req, routeDefinition))
          .then((response: ResponseObject) => {
            this.responseHandler(response, res);
          }).catch(err => {
            const status = err.statusCode ? err.statusCode : 500;
            if (process.env.NODE_ENV === 'production' && status >= 500)
              res.status(status).send({message: 'Internal Server Error'});
            else
              res.status(status).send(err);
          })
        ;
    });
  }

  private responseHandler(response: ResponseObject, res: ExpressResponse): void {
    response.headers.forEach((value, key) => res.header(key, value));
    res.status(response.statusCode);
    if (response instanceof StreamableResponse)
      response.fileReadStream.pipe(res);
    else
      res.send(response.content);
  }

  private uploadHandler(configuration: Configuration): RequestHandler {
    return (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void => {
      const configs = configuration.get('express_server');
      if (!configs['uploads']['enabled'] || req.method.toLowerCase() !== 'post') {
        return next();
      }

      const directory = configs['uploads']['directory'];
      if (!fs.existsSync(directory)) {
        throw new Error('Directory does not exist');
      }

      const form = new formidable.IncomingForm();
      form.uploadDir = configuration.get('express_server.uploads.directory');
      form.keepExtensions = true;
      form.multiples = configs['uploads']['multiples'];
      form.hash = configs['uploads']['hash'];
      form.parse(req, function(err: any, fields: any, files: any) {
        req['files'] = files;
        next(err);
      });
    };
  }
}