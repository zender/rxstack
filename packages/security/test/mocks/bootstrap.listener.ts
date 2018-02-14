import {ApplicationEvents, BootstrapEvent} from '@rxstack/application';
import {Observe} from '@rxstack/async-event-dispatcher';
import {metadataStorage, ControllerMetadata, RouteMetadata, Kernel} from '@rxstack/kernel';
import {Injectable} from 'injection-js';
import {TestController} from './test.controller';

@Injectable()
export class BootstrapListener {
  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {

    const controllerMetadata = new ControllerMetadata();
    controllerMetadata.target = TestController;
    controllerMetadata.path = '/test';

    metadataStorage.registerMetadata(controllerMetadata, [
      this.getIndexActionMetadata(),
      this.getAnonActionMetadata()
    ]);
  }

  private getIndexActionMetadata(): RouteMetadata {

    const routeMetadata = new RouteMetadata();
    routeMetadata.target = TestController;
    routeMetadata.path = '/index';
    routeMetadata.name = 'test_index';
    routeMetadata.propertyKey = 'indexAction';
    routeMetadata.httpMethod = 'GET';

    return routeMetadata;
  }

  private getAnonActionMetadata(): RouteMetadata {

    const routeMetadata = new RouteMetadata();
    routeMetadata.target = TestController;
    routeMetadata.path = '/anon';
    routeMetadata.name = 'test_anon';
    routeMetadata.propertyKey = 'anonAction';
    routeMetadata.httpMethod = 'GET';

    return routeMetadata;
  }
}