const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const appRootPath = require('app-root-path').path;

/**
 * Configuration component
 */
export class Configuration {

  static initialize(directory?: string, filename = 'environment'): void {
    Configuration.initAppDirectory();
    const dir = directory ? directory : process.env.APP_DIR + path.sep + 'src' + path.sep + 'environments';
    const basePath = dir + path.sep + filename;
    const envPath = dir + path.sep + filename + '.' + Configuration.getEnvironment();
    if (!fs.existsSync(basePath + '.js')) {
      throw new Error(`Base environment file ${basePath} does not exist.`);
    }
    const baseFile: Object = require(dir + path.sep + filename);

    if (fs.existsSync(envPath + '.js')) {
      const envFile: Object = require(dir + path.sep + filename + '.' + Configuration.getEnvironment());
      _.merge(baseFile, envFile);
    }
    Configuration.normalize(baseFile);
  }

  static initAppDirectory(): void {
    if (!process.env.APP_DIR) {
      process.env.APP_DIR = appRootPath;
    }
  }

  static getEnvironment(): string {
    let env: string = process.env.NODE_ENV ? process.env.NODE_ENV : 'development';
    return env.toLowerCase();
  }

  static normalize(data: Object): Object {
    Object.keys(data).forEach(name => {
      let value = data[name];

      if (Array.isArray(value)) {
        value.map((sub: any) => this.normalize(value));
      }

      if (typeof value === 'object') {
        data[name] = Configuration.normalize(value);
      }

      if (typeof value === 'string') {
        if (process.env[value]) {
          value = process.env[value];
        } else if (value.indexOf('.') === 0 || value.indexOf('..') === 0) {
          value = path.resolve(
            path.join(process.env.APP_DIR),
            value.replace(/\//g, path.sep)
          );
        }
        data[name] = value;
      }
    });
    return data;
  }
}