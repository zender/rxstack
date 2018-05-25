const fs = require('fs');
export const {promisify} = require('util');
export const readFile = promisify(fs.readFile);