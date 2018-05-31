import {Configuration} from '../src/index';
import {environment} from './environments/environment';
const path = require('path');
const appRootPath = require('app-root-path').path;

describe('Configuration', () => {
  process.env.NODE_ENV = 'TESTING';
  process.env['MY_VALUE'] = 'my env value';
  Configuration.initialize(__dirname + '/environments');

  it('should throw exception if directory does not exist', () => {
    const fn = () => {
      Configuration.initialize();
    };

    fn.should.throw('Base environment file');
  });

  it('should set app dir', () => {
    process.env.APP_DIR.should.equal(path.resolve(appRootPath));
  });

  it('should override default configuration', () => {
    environment.app.name.should.equal('MyTestApp');
  });

  it('should normalize env variable', () => {
    environment.app.env_value.should.equal('my env value');
  });

  it('should normalize path variable', () => {
    environment.app.dir.should.equal(process.env.APP_DIR + '/my-dir');
  });
});