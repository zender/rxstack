import {Response} from './response';

export class DownloadableResponse extends Response {
  constructor(public path: string, public name?: string) {
    super();
    this.type = 'downloadable';
  }
}