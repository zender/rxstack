import {Configuration} from '../src/index';

describe('Configuration', () => {
  let configuration: Configuration;

  beforeEach(() => {
    configuration = new Configuration();
  });

  it('should register required value', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        required_value: {
          required: true,
          type: 'string'
        },
      }
    });

    configuration.get('sample_path.required_value').should.be.equal('my required value');
  });

  it('should register default value', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        default_value: {
          required: false,
          type: 'string'
        },
      }
    }, {'default_value': 'my default value'});

    configuration.get('sample_path.default_value').should.be.equal('my default value');
  });

  it('should register nested value', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        nested_object: {
          type: 'object',
          required: true,
          properties: {
            prop1: {
              required: false,
              type: 'boolean'
            },
            prop2: {
              required: false,
              type: 'boolean'
            }
          }
        },
      }
    }, {
      'nested_object': {'prop1': true}
    });

    configuration.get('sample_path.nested_object.prop1').should.be.true;
  });

  it('should register file path', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        file_path_1: {
          required: false,
          type: 'string'
        },
        file_path_2: {
          required: false,
          type: 'string'
        },
      }
    }, {'file_path_1': './my-file1.txt', 'file_path_2': '../my-file2.txt'});

    configuration.get('sample_path.file_path_1').should.have.string('/my-file1.txt');
    configuration.get('sample_path.file_path_2').should.have.string('/my-file2.txt');
  });


  it('should register env variable', () => {
    process.env['MY_VALUE'] = 'my env value';

    configuration.register('sample_path', {
      type: 'object',
      properties: {
        env_var: {
          required: false,
          type: 'string'
        }
      }
    }, {'env_var': 'MY_VALUE'});

    configuration.get('sample_path.env_var').should.have.equal('my env value');
  });

  it('should throw an error if path already exists', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        env_var: {
          required: true,
          type: 'string'
        }
      }
    }, {'env_var': 'MY_VALUE'});

    const fn = () =>  {
      configuration.register('sample_path', {
        type: 'object',
        properties: {
          ny_var: {
            required: true,
            type: 'string'
          }
        }
      }, {'env_var': 'my var'});
    };

    fn.should.throw('Path sample_path already exists.');
  });

  it('should throw an error if root path is not an object', () => {
    const fn = () =>  {
      configuration.register('sample_path', {
        type: 'string',
        required: true
      });
    };
    fn.should.throw('Root path should be of type Object.');
  });

  it('should throw an error if path does not exist', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        my_var: {
          required: true,
          type: 'string'
        }
      }
    }, {'my_var': 'my var'});

    const fn = () => {
      configuration.get('sample_path.unknown');
    };

    fn.should.throw('Path sample_path.unknown does not exist.');
  });


  it('should throw an error if schema is not valid', () => {
    const fn = () =>  {
      configuration.register('sample_path', {
        type: 'object',
        properties: {
          my_var: {
            required: true,
            type: 'integer'
          }
        }
      }, {'my_var': 'my var'});

    };

    fn.should.throw();
  });

  it('should register express server', () => {

    configuration.register('express_server', {
        type: 'object',
        properties: {
          host: {
            required: false,
            type: 'string'
          },
          port: {
            required: false,
            type: 'integer'
          },
          prefix: {
            required: false,
            type: 'string'
          },
          uploads: {
            type: 'object',
            properties: {
              enabled: {
                required: false,
                type: 'boolean'
              },
              directory: {
                required: false,
                type: 'string'
              },
              multiples: {
                required: false,
                type: 'boolean'
              },
              hash: {
                required: false,
                type: 'string'
              },
            }
          }
        }
      }, {
        'host': 'localhost',
        'port': 3000,
        'prefix': 'api',
        'uploads': {
          'enabled': false,
          'multiples': false,
          'hash': 'md5'
        },
      });

    const expressConfig = configuration.get('express_server');
    expressConfig.host.should.be.equal('localhost');
    expressConfig.port.should.be.equal(3000);
    expressConfig.prefix.should.be.equal('new-prefix');
    expressConfig.uploads.enabled.should.be.true;
    expressConfig.uploads.multiples.should.be.false;
    expressConfig.uploads.hash.should.be.equal('sha256');
    expressConfig.uploads.directory.should.be.not.undefined;
  });
});