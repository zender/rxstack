import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ControllerMetadata, metadataStorage, RouteMetadata} from '@rxstack/kernel';
import { ApplicationEvents, BootstrapEvent } from '@rxstack/application';
import { SecurityController } from '../controllers/security-controller';

@Injectable()
export class BootstrapListener {

  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    const path = '/security';
    const controllerMetadata = new ControllerMetadata();
    controllerMetadata.target = SecurityController;
    controllerMetadata.path = path;

    metadataStorage.registerMetadata(controllerMetadata, [
      this.getLoginActionMetadata(),
    ]);
  }

  private getLoginActionMetadata(): RouteMetadata {
    const path = '/login';
    const routeMetadata = new RouteMetadata();
    routeMetadata.target = SecurityController;
    routeMetadata.path = path;
    routeMetadata.name = 'security_login';
    routeMetadata.propertyKey = 'loginAction';
    routeMetadata.httpMethod = 'POST';
    return routeMetadata;
  }
}
