export class ExpressFileUploadConfiguration {
  enabled: boolean;
  hash?: string;
  multiples?: boolean;
  directory: string;

  constructor(obj?: Object) {
    this.enabled = obj && obj['enabled'] || false;
    this.hash = obj && obj['hash'] || 'md5';
    this.multiples = obj && obj['multiples'] || false;
    this.directory = obj && obj['directory'] || null;
  }
}