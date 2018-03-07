import {Response} from './response';
import ReadableStream = NodeJS.ReadableStream;
import {RangeNotSatisfiableException} from '@rxstack/exceptions';
const fs = require('fs');
const path = require('path');
const mime = require('mime');

export class StreamableResponse extends Response {
  fileReadStream: ReadableStream;
  mimetype: string;
  name: string;
  size: number;
  constructor(public filePath: string, rawRange?: string) {
    super();

    const stat = fs.statSync(filePath);
    this.size = stat.size;
    this.name = path.basename(filePath);
    this.mimetype = mime.getType(filePath);

    if (rawRange) {
      const range = this.parseRange(rawRange);
      const chunkSize = (range.end - range.start) + 1;
      this.fileReadStream = fs.createReadStream(filePath, range);

      this.headers.set('Content-Range', `bytes ${range.start}-${range.end}/${this.size}`);
      this.headers.set('Accept-Ranges', 'bytes');
      this.headers.set('Content-Length', chunkSize);
      this.headers.set('Content-Type', this.mimetype);
      this.headers.set('Cache-Control', 'no-cache');
      this.statusCode = 206;
    } else {
      this.headers.set('Content-Length', this.size);
      this.headers.set('Content-Type', this.mimetype);
      this.fileReadStream = fs.createReadStream(filePath);
    }
  }

  private parseRange(raw: string): { start: number, end: number } {
    const parts = raw.split(/bytes=([0-9]*)-([0-9]*)/);
    let start = parseInt(parts[1], 10);
    let end = parseInt(parts[2], 10);
    let result = { start: 0, end: 0 };

    result.start = isNaN(start) ? 0 : start;
    result.end = isNaN(end) ? this.size - 1 : end;

    if (!isNaN(start) && isNaN(end)) {
      result.start = start;
      result.end = this.size - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
      result.start = this.size - end;
      result.end = this.size - 1;
    }

    if (start >= this.size || end >= this.size) {
      this.headers.set('Content-Range', 'bytes */' + this.size);
      throw new RangeNotSatisfiableException();
    }

    return result;
  }
}