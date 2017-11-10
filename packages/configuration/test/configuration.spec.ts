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

    configuration.lock();
    configuration.get('sample_path.required_value').should.be.equal('my required value');
  });

  it('should register default value', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        default_value: {
          required: true,
          type: 'string'
        },
      }
    }, {'default_value': 'my default value'});

    configuration.lock();
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
              required: true,
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

    configuration.lock();
    configuration.get('sample_path.nested_object.prop1').should.be.true;
  });

  it('should register file path', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        file_path_1: {
          required: true,
          type: 'string'
        },
        file_path_2: {
          required: true,
          type: 'string'
        },
      }
    }, {'file_path_1': './my-file1.txt', 'file_path_2': '../my-file2.txt'});

    configuration.lock();
    configuration.get('sample_path.file_path_1').should.have.string('/my-file1.txt');
    configuration.get('sample_path.file_path_2').should.have.string('/my-file2.txt');
  });


  it('should register env variable', () => {
    process.env['MY_VALUE'] = 'my env value';

    configuration.register('sample_path', {
      type: 'object',
      properties: {
        env_var: {
          required: true,
          type: 'string'
        }
      }
    }, {'env_var': 'MY_VALUE'});

    configuration.lock();
    configuration.get('sample_path.env_var').should.have.equal('my env value');
  });


  it('should throw an error if locked', () => {
    configuration.register('sample_path', {
      type: 'object',
      properties: {
        env_var: {
          required: true,
          type: 'string'
        }
      }
    }, {'env_var': 'MY_VALUE'});

    configuration.lock();

    let error: any;

    try {
      configuration.register('another_sample_path', {
        type: 'object',
        properties: {
          another_var: {
            required: true,
            type: 'string'
          }
        }
      }, {'env_var': 'MY_VALUE'});
    } catch (err) {
      error = err.message;
    }

    error.should.be.equal('Configuration is already locked.');
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

    let error: any;

    try {
      configuration.register('sample_path', {
        type: 'object',
        properties: {
          ny_var: {
            required: true,
            type: 'string'
          }
        }
      }, {'env_var': 'my var'});
    } catch (err) {
      error = err.message;
    }

    error.should.be.equal('Path sample_path already exists.');
  });

  it('should throw an error if root path is not an object', () => {
    let error: any;

    try {
      configuration.register('sample_path', {
        type: 'string',
        required: true
      });
    } catch (err) {
      error = err.message;
    }

    error.should.be.equal('Root path should be of type Object.');
  });

  it('should throw an error if path does not exist', () => {
    let error: any;

    configuration.register('sample_path', {
      type: 'object',
      properties: {
        my_var: {
          required: true,
          type: 'string'
        }
      }
    }, {'my_var': 'my var'});

    configuration.lock();

    try {
      configuration.get('sample_path.unknown');
    } catch (err) {
      error = err.message;
    }

    error.should.have.equal('Path sample_path.unknown does not exist.');
  });


  it('should throw an error if schema is not valid', () => {
    let error: any;

    try {
      configuration.register('sample_path', {
        type: 'object',
        properties: {
          my_var: {
            required: true,
            type: 'integer'
          }
        }
      }, {'my_var': 'my var'});

      configuration.lock();
    } catch (err) {
      error = err.message;
    }

    error.should.not.be.undefined;
  });
});