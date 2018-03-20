import {Injectable} from 'injection-js';
import {Observe} from '@rxstack/async-event-dispatcher';
import {
  ApplicationEvents, BootstrapEvent, HttpMetadata,
  httpMetadataStorage, WebSocketMetadata, webSocketMetadataStorage
} from '@rxstack/core';
import { SecurityController } from '../controllers/security-controller';
import {SecurityConfiguration} from '../security-configuration';

@Injectable()
export class BootstrapListener {

  constructor(private configuration: SecurityConfiguration) {}

  @Observe(ApplicationEvents.BOOTSTRAP)
  async onBootstrap(event: BootstrapEvent): Promise<void> {
    if (this.configuration.local_authentication) {
      const httpMetadata = [
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

      const socketMetadata = [
        {
          name: 'security_login',
          action: 'loginAction'
        },
        {
          name: 'security_logout',
          action: 'logoutAction'
        },
        {
          name: 'security_authenticate',
          action: 'authenticateAction'
        }
      ];

      httpMetadata.forEach(meta => httpMetadataStorage.add(this.createHttpMetadata(meta)));
      socketMetadata.forEach(meta => webSocketMetadataStorage.add(this.createWebSocketMetadata(meta)));
    }
  }

  private createHttpMetadata(meta: Object): HttpMetadata {
    const basePath = '/security';
    const routeMetadata = new HttpMetadata();
    routeMetadata.transport = 'HTTP';
    routeMetadata.target = SecurityController;
    routeMetadata.path = basePath + meta['path'];
    routeMetadata.name = meta['name'];
    routeMetadata.propertyKey = meta['action'];
    routeMetadata.httpMethod = 'POST';
    return routeMetadata;
  }

  private createWebSocketMetadata(meta: Object): WebSocketMetadata {
    const metadata = new WebSocketMetadata();
    metadata.transport = 'SOCKET';
    metadata.target = SecurityController;
    metadata.name = meta['name'];
    metadata.propertyKey = meta['action'];
    metadata.ns = '/';
    return metadata;
  }
}
