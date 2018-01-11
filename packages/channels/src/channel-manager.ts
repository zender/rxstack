import {Channel} from './channel';

export class ChannelManager {
  private stack: Map<string, Channel> = new Map();

  channels(...names: string[]): Channel {
    const channel = new Channel(names.join('_'));
    names.forEach((name: string) => channel.children.push(this.getChannel(name)));
    return channel;
  }

  private getChannel(name: string): Channel {
    if (!this.stack.has(name))
      this.stack.set(name, new Channel(name));
    return this.stack.get(name);
  }
}