export class File {
  name: string;
  size: number;
  type: string;
  path: string;
  hash?: string;

  constructor(obj?: any) {
    this.name = obj && obj.name || null;
    this.size = obj && obj.size || null;
    this.type = obj && obj.type || null;
    this.path = obj && obj.path || null;
    this.hash = obj && obj.hash || null;
  }
}