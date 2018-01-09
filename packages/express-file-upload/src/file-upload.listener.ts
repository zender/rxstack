import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ServerConfigurationEvent, ServerEvents} from '@rxstack/server-commons';
import {ExpressServer} from '@rxstack/express-server';
import {Configuration} from '@rxstack/configuration';
import {
  NextFunction, Request as ExpressRequest, RequestHandler,
  Response as ExpressResponse
} from 'express';
const formidable = require('formidable');
const fs = require('fs');

@Injectable()
export class FileUploadListener {
  constructor(private configuration: Configuration) { }

  @Observe(ServerEvents.CONFIGURE, -200)
  async onConfigure(event: ServerConfigurationEvent): Promise<void> {
    if (event.name !== ExpressServer.serverName) {
      return;
    }
    event.engine.use(this.uploadHandler());
  }

  private uploadHandler(): RequestHandler {
    return (req: ExpressRequest, res: ExpressResponse, next: NextFunction): void => {
      const configs = this.configuration.get('express_file_upload');
      if (!configs['enabled'] || req.method.toLowerCase() !== 'post') {
        return next();
      }

      const directory = configs['directory'];
      if (!fs.existsSync(directory))
        return next(new Error('Directory does not exist'));

      const form = new formidable.IncomingForm();
      form.uploadDir = configs['directory'];
      form.keepExtensions = true;
      form.multiples = configs['multiples'];
      form.hash = configs['hash'];
      form.parse(req, function(err: any, fields: any, files: any) {
        req['files'] = files;
        next(err);
      });
    };
  }
}