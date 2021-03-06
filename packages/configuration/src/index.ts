const path = require('path');
const _ = require('lodash');

class Configuration {

  initialize(dir: string, filename = 'environment'): void {
    const baseFile: Object = require(dir + path.sep + filename);
    try {
      const envFile: Object = require(dir + path.sep + filename + '.' + this.getEnvironment());
      _.merge(baseFile, envFile);
    } catch (e) {
      // do nothing
    }

    this.normalize(baseFile);
  }

  getRootPath(): string {
    return require('app-root-path').path;
  }

  getEnvironment(): string {
    let env: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
    return env.toLowerCase();
  }

  private normalize(data: Object): Object {
    Object.keys(data).forEach(name => {
      let value = data[name];

      if (Array.isArray(value)) {
        value.map((sub: any) => this.normalize(value));
      }

      if (typeof value === 'object') {
        data[name] = this.normalize(value);
      }

      if (typeof value === 'string') {
        if (process.env[value]) {
          value = process.env[value];
        } else if (value.indexOf('.') === 0 || value.indexOf('..') === 0) {
          value = path.resolve(
            path.join(this.getRootPath()),
            value.replace(/\//g, path.sep)
          );
        }
        data[name] = value;
      }
    });
    return data;
  }
}

export const configuration = new Configuration();