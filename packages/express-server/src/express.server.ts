import * as express from 'express';
import * as http from 'http';
import {
  Application as ExpressApplication, NextFunction, Request as ExpressRequest, RequestHandler,
  Response as ExpressResponse
} from 'express';
import * as bodyParser from 'body-parser';
import {Request, ResponseObject, RouteDefinition, StreamableResponse} from '@rxstack/kernel';
import {AbstractServer, ServerConfigurationEvent, ServerManager} from '@rxstack/server-commons';
import * as compress from 'compression';
import * as cors from 'cors';
import {ServiceRegistry} from '@rxstack/service-registry';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ServerEvents} from '@rxstack/server-commons/server-events';
import {Configuration} from '@rxstack/configuration';
import {Logger} from '@rxstack/logger';
const formidable = require('formidable');
const fs = require('fs');

@ServiceRegistry(ServerManager.ns, 'server.express')
export class ExpressServer extends AbstractServer {

  protected app: ExpressApplication;

  getEngine(): any {
    return this.app;
  }

  async startEngine(): Promise<void> {
    this.getHttpServer()
      .listen(this.port, this.host, () => this.getLogger().debug(`Starting ${this.getHost()}`));
  }

  async stopEngine(): Promise<void> {
    this.getHttpServer().close(() => this.getLogger().debug(`Stopping ${this.getHost()}`));
  }

  protected getLogger(): Logger {
    return this.getInjector().get(Logger).source(this.constructor.name);
  }

  protected async configure(routeDefinition: RouteDefinition[]): Promise<void> {
    const configuration = this.injector.get(Configuration);
    const dispatcher = this.injector.get(AsyncEventDispatcher);
    this.host = configuration.get('express_server.host');
    this.port = configuration.get('express_server.port');

    this.app = express();
    this.app.options('*', cors());
    this.app.use(cors());
    this.app.use(compress());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(this.uploadHandler(configuration));

    await dispatcher.dispatch(ServerEvents.PRE_CONFIGURE, new ServerConfigurationEvent(this));
    // register routes
    routeDefinition.forEach(routeDefinition => this.registerRoute(routeDefinition));
    await dispatcher.dispatch(ServerEvents.POST_CONFIGURE, new ServerConfigurationEvent(this));
    this.httpServer = http.createServer(<any>(this.app));
  }

  private async registerRoute(routeDefinition: RouteDefinition): Promise<void> {
    return this.app[routeDefinition.method.toLowerCase()](routeDefinition.path,
      async (req: ExpressRequest, res: ExpressResponse): Promise<void> => {
      const request = new Request('HTTP');
      request.path = routeDefinition.path;
      request.headers.fromObject(req.headers);
      request.query.fromObject(req.query);
      request.params.fromObject(req.params);
      request.files.fromObject(req['files'] || {});
      request.body = req.body;

      return routeDefinition.handler(request)
        .then((response: ResponseObject) => {
          this.responseHandler(response, res);
        }).catch(err => {
          let status = err.statusCode ? err.statusCode : 500;
          if (process.env.NODE_ENV === 'production' && status === 500)
            res.status(status).send({message: 'Internal Server Error'});
          else
            res.status(status).send(err);
        });
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
      if (!configuration.get('express_server.enable_uploads') || req.method.toLowerCase() !== 'post') {
        return next();
      }
      const form = new formidable.IncomingForm();
      form.uploadDir = configuration.get('express_server.upload_directory');
      form.keepExtensions = true;
      form.multiples = false;
      form.hash = 'md5';
      form.parse(req, function(err: any, fields: any, files: any) {
        req['files'] = files;
        next(err);
      });
    };
  }
}