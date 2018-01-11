import 'reflect-metadata';
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {Injector} from 'injection-js';
import {SocketIOServer} from '../src/socketio.server';
import {MockEventListener} from './mocks/mock-event-listener';
const io = require('socket.io-client');


describe('SocketIOServer', () => {
  // Setup application
  const app = new Application(AppModule);
  let injector: Injector;
  let host: string;
  let server: SocketIOServer;
  let client: any;

  before(async() =>  {
    injector = await app.start();
    server = injector.get(SocketIOServer);
    host = server.getHost();
    client = io(host, {transports: ['websocket']});
  });

  after(async() =>  {
    client.close();
    await app.stop();
  });

  it('should get the engine', () => {
    (typeof server.getEngine()).should.not.be.undefined;
  });


  it('should call mock_json', (done: Function) => {
    client.emit('mock_json', null, function (response: any) {
      response['statusCode'].should.be.equal(200);
      JSON.stringify(response['content']).should.be.equal(JSON.stringify({ id: 'json' }));
      done();
    });
  });

  it('should call mock_null', (done: Function) => {
    client.emit('mock_null', null, function (response: any) {
      response['statusCode'].should.be.equal(200);
      (null === response['content']).should.be.true;
      done();
    });
  });

  it('should throw an 404 exception', (done: Function) => {
    const args = {
      'params': {
        'code': 404
      }
    };

    client.emit('mock_exception', args, function (response: any) {
      response['statusCode'].should.be.equal(404);
      response['message'].should.be.equal('Not Found');
      done();
    });
  });

  it('should throw an 500 exception', (done: Function) => {
    const args = {
      'params': {
        'code': 500
      }
    };

    client.emit('mock_exception', args, function (response: any) {
      response['statusCode'].should.be.equal(500);
      response['message'].should.be.equal('something');
      done();
    });
  });

  it('should throw an 500 exception in production', (done: Function) => {
    const args = {
      'params': {
        'code': 500
      }
    };

    process.env.NODE_ENV = 'production';

    client.emit('mock_exception', args, function (response: any) {
      response['statusCode'].should.be.equal(500);
      response['message'].should.be.equal('Internal Server Error');
      process.env.NODE_ENV = 'testing';
      done();
    });
  });

  it('should throw exception if streamable', (done: Function) => {
    client.emit('mock_stream', null, function (response: any) {
      response['statusCode'].should.be.equal(500);
      response['message'].should.be.equal('StreamableResponse is not supported.');
      done();
    });
  });


  it('should add connected users', (done: Function) => {
    const client2 = io(host, {transports: ['websocket']});
    client2.on('connect', () => {
      injector.get(MockEventListener).connectedUsers.length.should.be.equal(2);
      client2.close();
      done();
    });
  });
});
