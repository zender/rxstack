import 'reflect-metadata';
import {Application} from '@rxstack/application';
import {AppModule} from './mocks/app.module';
import {IncomingMessage} from 'http';
const rp = require('request-promise');
const fs = require('fs');
const assetsDir = process.mainModule['paths'][0].split('node_modules')[0].slice(0, -1) + '/test/assets';

describe('ExpressFileUpload', () => {
  // Setup application
  const app = new Application(AppModule);
  let host = 'http://localhost:3200';

  before(async() =>  {
    await app.start();
  });

  after(async() =>  {
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
});
