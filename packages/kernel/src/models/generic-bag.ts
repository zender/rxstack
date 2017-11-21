export class GenericBag<T> extends Map<string, T> {
  constructor(data?: Object) {
    super();
    if (data) {
      this.fromObject(data);
    }
  }

  toObject(): Object {
    const data: Object = {};
    this.forEach((value: T, key: string) => data[key] = value);
    return data;
  }

  fromObject(data?: Object): this {
    for (let key in data) {
      this.set(key, data[key]);
    }
    return this;
  }
}