import {Connection, FilterFn} from './interfaces';

export class Channel {

  connections: Connection[] = [];

  children: Channel[] = [];

  constructor(public ns: string) {}

  get length(): number {
    return this.connections.length;
  }

  merge(channel: Channel): this {
    if (this.children.indexOf(channel) === -1) {
      this.children.push(channel);
      this.join(...channel.connections);
    }
    return this;
  }

  join(...connections: Connection[]): this {
    connections.forEach(connection => {
      if (this.connections.indexOf(connection) === -1) {
        this.connections.push(connection);
      }
    });
    this.children.forEach((current) => current.join(...connections));
    return this;
  }

  leave(...connections: Connection[]): this {
    connections.forEach(current => {
      const index = this.connections.indexOf(current);
      if (index !== -1) {
        this.connections.splice(index, 1);
      }
    });
    this.children.forEach((current) => current.leave(...connections));
    return this;
  }

  send(data: any, fn?: FilterFn): this {
    let connections = fn ? this.connections.filter(fn) : this.connections;
    connections.forEach((current: Connection) => current.emit(data));
    return this;
  }
}