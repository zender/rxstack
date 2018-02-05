import {Configuration} from '../src/index';
import {config} from './env/config';

describe('Configuration with default env', () => {
  delete process.env.NODE_ENV;
  Configuration.initialize(__dirname + '/env', 'config');

  it('should initialize if environment file does not exist', () => {
    config.app.name.should.equal('MyDevApp');
  });
});