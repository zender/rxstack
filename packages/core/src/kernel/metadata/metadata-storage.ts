import {ControllerMetadata, RouteMetadata} from './metadata';
import {Exception} from '@rxstack/exceptions';

/**
 * Metadata storage for controllers and routes
 */
export class MetadataStorage {
  /**
   * Container of all controller metadata
   *
   * @type {Array}
   */
  private controllerMetadataCollection: ControllerMetadata[] = [];

  /**
   * Contailer of all route metadata
   *
   * @type {Array}
   */
  private routeMetadataCollection: RouteMetadata[] = [];

  /**
   * Retrieve all controller metadata
   *
   * @returns {ControllerMetadata[]}
   */
  getControllerMetadataCollection(): ControllerMetadata[] {
    return this.controllerMetadataCollection;
  }

  /**
   * Checks if controller metadata exists.
   *
   * @param {Function} target
   * @returns {boolean}
   */
  hasControllerMetadata(target: Function): boolean {
    return !!this.getControllerMetadata(target);
  }

  /**
   * Retrieves controller metadata
   *
   * @param {Function} target
   * @returns {ControllerMetadata}
   */
  getControllerMetadata(target: Function): ControllerMetadata {
    return this.controllerMetadataCollection.find((metadata) => metadata.target === target);
  }

  /**
   * Adds controller metadata
   *
   * @param {ControllerMetadata} controllerMetadata
   */
  addControllerMetadata(controllerMetadata: ControllerMetadata): void {
    if (this.hasControllerMetadata(controllerMetadata.target))
      throw new Exception(`Controller ${controllerMetadata.target.constructor.name} metadata already exists.`);
    this.controllerMetadataCollection.push(controllerMetadata);
  }

  /**
   * Removes controller metadata
   *
   * @param {Function} target
   */
  removeControllerMetadata(target: Function): void {
    const idx = this.controllerMetadataCollection
      .findIndex((metadata) => metadata.target === target);
    if (idx === -1)
      throw new Exception(`Controller ${target.constructor.name} metadata already exists.`);
    this.controllerMetadataCollection.splice(idx, 1);
    this.getRouteMetadataCollection(target)
      .forEach((routeMetadata) => this.removeRouteMetadata(routeMetadata.name));
  }

  /**
   * Retrieves all route metadata
   *
   * @param {Function} target
   * @returns {RouteMetadata[]}
   */
  getRouteMetadataCollection(target?: Function): RouteMetadata[] {
    if (target)
      return this.routeMetadataCollection.filter((metadata) => metadata.target === target);
    return this.routeMetadataCollection;
  }

  /**
   * Retrieves route metadata
   *
   * @param {string} name
   * @returns {RouteMetadata}
   */
  getRouteMetadata(name: string): RouteMetadata {
    return this.routeMetadataCollection.find(metadata => metadata.name === name);
  }

  /**
   * Checks if route metadata exists
   *
   * @param {string} name
   * @returns {boolean}
   */
  hasRouteMetadata(name: string): boolean {
    return !!this.getRouteMetadata(name);
  }

  /**
   * Adds route metadata
   *
   * @param {RouteMetadata} routeMetadata
   */
  addRouteMetadata(routeMetadata: RouteMetadata): void {
    if (this.hasRouteMetadata(routeMetadata.name))
      throw new Exception(`Route ${routeMetadata.name} metadata already exists.`);
    this.routeMetadataCollection.push(routeMetadata);
  }

  /**
   * Removes route metadata
   *
   * @param {string} name
   */
  removeRouteMetadata(name: string): void {
    const idx = this.routeMetadataCollection
      .findIndex((metadata) => metadata.name === name);
    if (idx === -1)
      throw new Exception(`Route ${name} metadata does not exist.`);
    this.routeMetadataCollection.splice(idx, 1);
  }

  /**
   * Register controller and routes
   *
   * @param {ControllerMetadata} controllerMetadata
   * @param {RouteMetadata[]} routeMetadataCollection
   */
  registerMetadata(controllerMetadata: ControllerMetadata, routeMetadataCollection: RouteMetadata[]): void {
    this.addControllerMetadata(controllerMetadata);
    routeMetadataCollection.forEach((metadata) => this.addRouteMetadata(metadata));
  }

  /**
   * Reset controller and route metadata
   */
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
