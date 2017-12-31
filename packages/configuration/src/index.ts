const config = require('config');
const schemaValidator = require('is-my-json-valid');
const path = require('path');
const _ = require('lodash');

/**
 * Configuration component
 */
export class Configuration {

  private items: Map<string, Object> = new Map();

  register(path: string, schema: Object, defaultValue = {}): void {
    if (this.items.has(path))
      throw new Error(`Path ${path} already exists.`);

    if (schema['type'] !== 'object')
      throw new Error('Root path should be of type Object.');

    let data = _.merge(defaultValue, config.get(path));
    data = this.normalize(data);
    this.validate(path, schema, data);
    this.items.set(path, data);
  }

  get(path: string): any {
    const rootPath = path.split('.').shift();
    const obj = this.items.get(rootPath);
    const value = path.split('.').reduce((v, idx) => v[idx], {[rootPath]: obj});
    if (!value)
      throw new Error(`Path ${path} does not exist.`);

    return value;
  }

  private validate(path: string, schema: Object, data: Object): void {
    const validate = schemaValidator(schema, {verbose: true, greedy: true});

    if (!validate(data)) {
      const message = ('Configuration is not valid: ' + JSON.stringify(validate.errors))
        .replace('data.', path + '.');
      throw new Error(message);
    }
  }

  private normalize(data: Object): Object {
    Object.keys(data).forEach(name => {
      let value = data[name];

      if (typeof value === 'object') {
        data[name] = this.normalize(value);
      }

      if (typeof value === 'string') {
        if (process.env[value]) {
          value = process.env[value];
        } else if (value.indexOf('.') === 0 || value.indexOf('..') === 0) {
          value = path.resolve(
            path.join(config.util.getEnv('NODE_CONFIG_DIR')),
            value.replace(/\//g, path.sep)
          );
        }
        data[name] = value;
      }
    });
    return data;
  }
}

/**
 * Exports single instance of Configuration
 *
 * @type {Configuration}
 */
export const configuration = new Configuration();