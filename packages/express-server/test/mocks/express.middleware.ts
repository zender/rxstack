import { Request as ExpressRequest, Response as ExpressResponse, NextFunction, RequestHandler } from 'express';
import {Injector} from 'injection-js';
const formidable = require('formidable');
const util = require('util');
const uploadDir = '/home/zender/apps/rxstack/rxstack/packages/express-server/test/uploads';



export function expressMiddleware(injector: Injector): RequestHandler {
  return (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {
    response.json({'id': 'express'});
  };
}

export function requestModifierMiddleware(injector: Injector): RequestHandler {
  return (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {

    request.params.custom_param = 'custom_value';
    next();
  };
}

export function fileUploadMiddleware(injector: Injector): RequestHandler {
  return (request: ExpressRequest, response: ExpressResponse, next: NextFunction): void => {
    if (request.method.toLowerCase() !== 'post') {
      return next();
    }

    const form = new formidable.IncomingForm();
    form.uploadDir = uploadDir;
    form.keepExtensions = true;
    form.multiples = false;
    form.hash = 'md5';
    form.parse(request, function(err: any, fields: any, files: any) {
      request['files'] = files;
      next(err);
    });
  };
}
