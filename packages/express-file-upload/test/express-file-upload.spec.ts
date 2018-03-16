import 'reflect-metadata';
import {Configuration} from '@rxstack/configuration';
Configuration.initialize(__dirname + '/environments', 'file_upload_environment');
import {Application} from '@rxstack/core';
import {AppModule} from './mocks/app.module';
import {IncomingMessage} from 'http';
import {file_upload_environment} from './environments/file_upload_environment';
const rp = require('request-promise');
const fs = require('fs-extra');
const assetsDir = process.env.APP_DIR + '/test/assets';

describe('ExpressFileUpload', () => {
  // Setup application
  const app = new Application(AppModule.configure(file_upload_environment), file_upload_environment);
  let host = 'http://localhost:3210';

  before(async() =>  {
    fs.mkdirsSync(assetsDir + '/../uploads');
    await app.start();
  });

  after(async() =>  {
    fs.removeSync(assetsDir + '/../uploads');
    await app.stop();
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

  it('should skip express middleware', async () => {
    const options = {
      uri: host + '/mock/upload',
      method: 'GET',
      resolveWithFullResponse: true,
      json: true
    };

    await rp(options)
      .then((response: IncomingMessage) => {
        response['body'].should.be.equal('dummy');
        response['statusCode'].should.be.equal(200);
      })
      .catch((err: any) => console.log(err))
    ;
  });
});
