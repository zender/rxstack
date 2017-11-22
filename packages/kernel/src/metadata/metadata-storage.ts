import {ControllerMetadata, RouteMetadata} from './metadata';
import {Exception} from '@rxstack/exceptions';

export class MetadataStorage {
  private controllerMetadataCollection: ControllerMetadata[] = [];
  private routeMetadataCollection: RouteMetadata[] = [];

  getControllerMetadataCollection(): ControllerMetadata[] {
    return this.controllerMetadataCollection;
  }

  hasControllerMetadata(target: Function): boolean {
    return !!this.getControllerMetadata(target);
  }

  getControllerMetadata(target: Function): ControllerMetadata {
    return this.controllerMetadataCollection.find((metadata) => metadata.target === target);
  }

  addControllerMetadata(controllerMetadata: ControllerMetadata): void {
    if (this.hasControllerMetadata(controllerMetadata.target))
      throw new Exception(`Controller ${controllerMetadata.target.constructor.name} metadata already exists.`);
    this.controllerMetadataCollection.push(controllerMetadata);
  }

  removeControllerMetadata(target: Function): void {
    const idx = this.controllerMetadataCollection
      .findIndex((metadata) => metadata.target === target);
    if (idx !== -1) {
      this.controllerMetadataCollection.splice(idx, 1);
      this.getRouteMetadataCollection(target)
        .forEach((routeMetadata) => this.removeRouteMetadata(routeMetadata.name));
    }
  }

  getRouteMetadataCollection(target?: Function): RouteMetadata[] {
    if (target)
      return this.routeMetadataCollection.filter((metadata) => metadata.target === target);
    return this.routeMetadataCollection;
  }

  getRouteMetadata(name: string): RouteMetadata {
    return this.routeMetadataCollection.find(metadata => metadata.name === name);
  }

  hasRouteMetadata(name: string): boolean {
    return !!this.getRouteMetadata(name);
  }

  addRouteMetadata(routeMetadata: RouteMetadata): void {
    if (this.hasRouteMetadata(routeMetadata.name))
      throw new Exception(`Route ${routeMetadata.name} metadata already exists`);
    this.routeMetadataCollection.push(routeMetadata);
  }

  removeRouteMetadata(name: string): void {
    const idx = this.routeMetadataCollection
      .findIndex((metadata) => metadata.name === name);
    if (idx !== -1) {
      this.routeMetadataCollection.splice(idx, 1);
    }
  }

  registerMetadata(controllerMetadata: ControllerMetadata, routeMetadata: RouteMetadata[]): void {
    this.addControllerMetadata(controllerMetadata);
    routeMetadata.forEach((metadata) => this.addRouteMetadata(metadata));
  }

  reset(): void {
    this.controllerMetadataCollection = [];
    this.routeMetadataCollection = [];
  }
}

/**
 * Exports single instance of MetadataStorage
 *
 * @type {MetadataStorage}
 */
export const metadataStorage = new MetadataStorage();
