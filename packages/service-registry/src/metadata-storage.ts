/**
 * The MetadataStorage registers service with @ServiceRegistry annotation.
 */
import {ServiceRegistryMetadata} from './metadata';

export class MetadataStorage {
  /**
   * Container of all services
   *
   * @type {Array}
   */
  data: ServiceRegistryMetadata[] = [];

  /**
   * Retrieve service by namespace
   *
   * @param {string} ns
   * @returns {ServiceRegistryMetadata[]}
   */
  all(ns: string): ServiceRegistryMetadata[] {
    return this.data
      .filter((item: ServiceRegistryMetadata) => {
        return item.ns === ns;
      })
      .sort((a: ServiceRegistryMetadata , b: ServiceRegistryMetadata) => a.priority - b.priority)
    ;
  }

  /**
   * Adds service to container
   *
   * @param {ServiceRegistryMetadata} metadata
   */
  add(metadata: ServiceRegistryMetadata): void {
    this.data.push(metadata);
  }

  /**
   * Gets service from container
   *
   * @param {Function} target
   * @param {string} ns
   * @returns {ServiceRegistryMetadata}
   */
  get(target: Function, ns: string): ServiceRegistryMetadata {
    const idx = this.findIndex(target, ns);
    return idx !== -1 ? this.data[idx] : null;
  }

  /**
   * Removes service from container
   *
   * @param {Function} target
   * @param {string} ns
   */
  remove(target: Function, ns: string): void {
    const idx = this.data
      .findIndex((metadata: ServiceRegistryMetadata) => metadata.ns === ns && metadata.target === target);
    if (idx !== -1) {
      this.data.splice(idx, 1);
    }
  }

  /**
   * Finds service index
   *
   * @param {Function} target
   * @param {string} ns
   * @returns {number}
   */
  private findIndex(target: Function, ns: string): number {
    return this.data
      .findIndex((metadata: ServiceRegistryMetadata) => metadata.ns === ns && metadata.target === target);
  }
}

/**
 * Exports single instance of MetadataStorage
 *
 * @type {MetadataStorage}
 */
export const metadataStorage = new MetadataStorage();
