import {ControllerMetadata} from './metadata';
import {ControllerOptions} from './controller-options';
import {MethodDefinition} from '../interfaces';

export class MetadataStorage {
  private controllerMetadata: ControllerMetadata[] = [];

  getControllerMetadataCollection(): ControllerMetadata[] {
    return this.controllerMetadata;
  }

  hasControllerMetadata(target: Function): boolean {
    return !!this.controllerMetadata.find(meta => meta.target === target);
  }

  addControllerMetadata(target: Function, options: ControllerOptions): void {
    const metadata = this.findControllerMetadata(target);
    metadata.options.routeBase = options.routeBase;
  }

  findControllerMetadata(target: Function): ControllerMetadata {
    let metadata = this.controllerMetadata.find(meta => meta.target === target);
    if (!metadata)
      metadata = new ControllerMetadata(target);
      this.controllerMetadata.push(metadata);
    return metadata;
  }

  addMethodDefinition(target: Function, propertyKey: string, methodDefinition: MethodDefinition): void {
    const metadata = this.findControllerMetadata(target);
    metadata.methodDefinitions.set(propertyKey, methodDefinition);
  }

  registerControllerMetadata(metadata: ControllerMetadata): void {
    if (this.hasControllerMetadata(metadata.target))
      throw new Error(`Controller ${metadata.target.name} is already registered.`);
    this.controllerMetadata.push(metadata);
  }

  reset(): void {
    this.controllerMetadata = [];
  }

}

/**
 * Exports single instance of MetadataStorage
 *
 * @type {MetadataStorage}
 */
export const metadataStorage = new MetadataStorage();
