import {Response} from './response';
import ReadableStream = NodeJS.ReadableStream;
const fs = require('fs');
const mime = require('mime');

export class StreamedResponse extends Response {
  fileReadStream: ReadableStream;
  mimetype: string;
  size: number;
  constructor(public path: string, range?: { start: number, end: number }) {
    super();

    const stat = fs.statSync(path);
    this.size = stat.size;
    this.mimetype = mime.getType(path);
    this.type = 'streamed';

    if (range) {
      this.size = (range.end - range.start) + 1;
      this.fileReadStream = fs.createReadStream(path, {start: range.start, end: range.end});

      this.headers.set('Content-Range', `bytes ${range.start}-${range.end}/${this.size}`);
      this.headers.set('Accept-Ranges', 'bytes');
      this.headers.set('Content-Length', this.size);
      this.headers.set('Content-Type', this.mimetype);
      this.statusCode = 206;
    } else {
      this.headers.set('Content-Length', this.size);
      this.headers.set('Content-Type', this.mimetype);
      this.fileReadStream = fs.createReadStream(path);
    }
  }
}