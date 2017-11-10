import {ServiceRegistry} from '../src/decorators';

export interface MyInterface {
  apply(value: number): number;
}

export class MyManager implements MyInterface {
  static ns = 'my-manager';
  services: Map<string, MyInterface> = new Map();

  apply(value: number): number {
    this.services.forEach((service: MyInterface) => {
      value = service.apply(value);
    });
    return value;
  }
}

@ServiceRegistry(MyManager.ns, 'my-service-1', 2)
export class MyService1 implements MyInterface {
  apply(value: number): number {
    return value + 1;
  }
}

@ServiceRegistry(MyManager.ns, 'my-service-2')
export class MyService2 implements MyInterface {
  apply(value: number): number {
    return value + 2;
  }
}

@ServiceRegistry(MyManager.ns, 'my-service-3', 3)
export class MyService3 implements MyInterface {
  apply(value: number): number {
    return value + 3;
  }
}

export class MyService4 implements MyInterface {
  apply(value: number): number {
    return value + 4;
  }
}

