import * as express from 'express';
import * as http from 'http';
import {Application as ExpressApplication, Request as ExpressRequest, Response as ExpressResponse} from 'express';
import * as bodyParser from 'body-parser';
import {Request, Response, RouteDefinition} from '@rxstack/kernel';
import {AbstractServer, ServerConfigurationEvent, ServerManager} from '@rxstack/server-commons';
import * as compress from 'compression';
import * as cors from 'cors';
import {ServiceRegistry} from '@rxstack/service-registry';
import {AsyncEventDispatcher} from '@rxstack/async-event-dispatcher';
import {ServerEvents} from '@rxstack/server-commons/server-events';
import {Configuration} from '@rxstack/configuration';
import {Logger} from '@rxstack/logger';

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
    this.app.use(compress());
    this.app.options('*', cors());
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));

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