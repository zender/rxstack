import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {ControllerMetadata, metadataStorage, RouteMetadata} from '@rxstack/kernel';
import { ApplicationEvents, BootstrapEvent } from '@rxstack/application';
import { SecurityController } from '../controllers/security-controller';
import {SecurityConfiguration} from '../security-configuration';

@Injectable()
export class BootstrapListener {

  constructor(private configuration: SecurityConfiguration) {}

  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    const path = '/security';
    const controllerMetadata = new ControllerMetadata();
    controllerMetadata.target = SecurityController;
    controllerMetadata.path = path;

    const metadata: any[] = [];
    const localAuthMetadata = [
      {
        path: '/login',
        name: 'security_login',
        action: 'loginAction'
      },
      {
        path: '/refresh-token',
        name: 'security_refresh_token',
        action: 'refreshTokenAction'
      },
      {
        path: '/logout',
        name: 'security_logout',
        action: 'logoutAction'
      }
    ];

    if (this.configuration.local_authentication) {
      metadata.push(...localAuthMetadata);
    }
    if (this.configuration.socket_authentication) {
      metadata.push({
        path: '/authenticate',
        name: 'security_authenticate',
        action: 'authenticateAction'
      });
    }
    const routes: RouteMetadata[] = [];
    metadata.forEach(meta => routes.push(this.createActionMetadata(meta)));
    metadataStorage.registerMetadata(controllerMetadata, routes);
  }

  private createActionMetadata(meta: Object): RouteMetadata {
    const routeMetadata = new RouteMetadata();
    routeMetadata.target = SecurityController;
    routeMetadata.path = meta['path'];
    routeMetadata.name = meta['name'];
    routeMetadata.propertyKey = meta['action'];
    routeMetadata.httpMethod = 'POST';
    return routeMetadata;
  }
}
