import 'reflect-metadata';
import {ExpressServer} from '../src/express.server';
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {IncomingMessage} from 'http';
const rp = require('request-promise');

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
});
