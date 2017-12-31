import 'reflect-metadata';
import {ExpressServer} from '../src/express.server';
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {IncomingMessage} from 'http';
import {Configuration} from '@rxstack/configuration';
const rp = require('request-promise');
const fs = require('fs');
const assetsDir = process.mainModule['paths'][0].split('node_modules')[0].slice(0, -1) + '/test/assets';

describe('ExpressServer', () => {
  // Setup application
  const app = new Application(AppModule);
  let injector: Injector;
  let host: string;
  let expressServer: ExpressServer;

  before(async() =>  {
    injector = await app.start();
    expressServer = injector.get(ExpressServer);
    host = expressServer.getHost();
  });

  after(async() =>  {
    await app.stop();
  });

  it('should get the engine', async () => {
    (typeof expressServer.getEngine()).should.not.be.undefined;
  });

  it('should call mock_text', async () => {
    const options = {
      uri: host + '/mock/text',
      qs: {},
      headers: { },
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        const headers = response.headers;
        headers['x-powered-by'].should.be.equal('Express');
        headers['content-type'].should.be.equal('text/html; charset=utf-8');
        response['statusCode'].should.be.equal(200);
        response['body'].should.be.equal('something');
      })
      .catch((err: any) => console.log(err))
    ;
  });

  it('should call mock_json', async () => {
    const options = {
      uri: host + '/mock/json',
      qs: {},
      headers: { },
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        const headers = response.headers;
        headers['x-powered-by'].should.be.equal('Express');
        headers['content-type'].should.be.equal('application/json; charset=utf-8');
        response['statusCode'].should.be.equal(200);
        JSON.stringify(response['body']).should.be.equal(JSON.stringify({ id: 'json' }));
      })
      .catch((err: any) => console.log(err))
    ;
  });

  it('should call express middleware', async () => {
    const options = {
      uri: host + '/express-middleware',
      qs: {},
      headers: { },
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        const headers = response.headers;
        headers['x-powered-by'].should.be.equal('Express');
        headers['content-type'].should.be.equal('application/json; charset=utf-8');
        response['statusCode'].should.be.equal(200);
        JSON.stringify(response['body']).should.be.equal(JSON.stringify({ id: 'express' }));
      })
      .catch((err: any) => console.log(err))
    ;
  });

  it('should upload file', async () => {
    const options = {
      uri: host + '/mock/upload',
      method: 'POST',
      formData: {
        file: fs.createReadStream(assetsDir + '/image.jpg'),
      },
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        response['body']['name'].should.be.equal('image.jpg');
        response['statusCode'].should.be.equal(200);
      })
      .catch((err: any) => console.log(err))
    ;
  });

  it('should download file', async () => {
    const options = {
      uri: host + '/mock/download',
      method: 'GET',
      resolveWithFullResponse: true,
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        const headers = response.headers;
        response['statusCode'].should.be.equal(200);
        headers['content-disposition'].should.be.equal('attachment; filename="video.mp4"');
        headers['content-type'].should.be.equal('video/mp4');
      })
      .catch((err: any) => console.log(err))
    ;
  });

  it('should stream video', async () => {
    const options = {
      uri: host + '/mock/stream',
      headers: {
        'Range': 'bytes=1-200'
      },
      method: 'GET',
      resolveWithFullResponse: true,
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        response['statusCode'].should.be.equal(206);
        response['headers']['content-range'].should.be.equal('bytes 1-200/424925');
        response['headers']['content-length'].should.be.equal('200');
      })
      .catch((err: any) => console.log(err))
    ;
  });

  it('should throw an 404 exception', async () => {
    const options = {
      uri: host + '/mock/exception',
      method: 'GET',
      resolveWithFullResponse: true,
      qs: {
        'code': 404
      },
      json: true
    };

    await rp(options)
      .catch((err: any) => {

        err['statusCode'].should.be.equal(404);
        err['response']['body']['message'].should.be.equal('Not Found');
      })
    ;
  });

  it('should throw an exception', async () => {
    const options = {
      uri: host + '/mock/exception',
      method: 'GET',
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .catch((err: any) => {

        err['statusCode'].should.be.equal(500);
        err['response']['body']['message'].should.be.equal('something');
      })
    ;
  });

  it('should throw an exception in production', async () => {
    process.env.NODE_ENV = 'production';
    const options = {
      uri: host + '/mock/exception',
      method: 'GET',
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .catch((err: any) => {

        err['statusCode'].should.be.equal(500);
        err['response']['body']['message'].should.be.equal('Internal Server Error');
      })
    ;
    process.env.NODE_ENV = 'testing';
  });
});
