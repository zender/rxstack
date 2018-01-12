import {Channel} from './channel';

export class ChannelManager {
  private stack: Map<string, Channel> = new Map();

  channels(...names: string[]): Channel {
    const channel = this.channel(names.join('_'));
    names.forEach((name: string) => channel.merge(this.channel(name)));
    return channel;
  }

  channel(name: string): Channel {
    if (!this.stack.has(name))
      this.stack.set(name, new Channel(name));
    return this.stack.get(name);
  }

  reset(): void {
    this.stack.clear();
  }
}