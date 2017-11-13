import {ControllerMetadata} from './metadata';
import {ControllerOptions} from './controller-options';
import {MethodDefinition} from '../intefaces';

export class MetadataStorage {
  public controllerMetadata: ControllerMetadata[] = [];

  public hasControllerMetadata(target: Function): boolean {
    return !!this.controllerMetadata.find(meta => meta.target === target);
  }

  public addControllerMetadata(target: Function, options: ControllerOptions): void {
    const metadata = this.findControllerMetadata(target);
    metadata.options.routeBase = options.routeBase;
  }

  public addMethodDefinition(target: Function, propertyKey: string, methodDefinition: MethodDefinition): void {
    const metadata = this.findControllerMetadata(target);
    metadata.methodDefinitions.set(propertyKey, methodDefinition);

    if (!this.hasControllerMetadata(target)) {
      this.controllerMetadata.push(metadata);
    }
  }

  private findControllerMetadata(target: Function): ControllerMetadata {
    let metadata = this.controllerMetadata.find(meta => meta.target === target);

    if (!metadata) {
      metadata = new ControllerMetadata(target);
    }

    return metadata;
  }
}

/**
 * Exports single instance of MetadataStorage
 *
 * @type {MetadataStorage}
 */
export const metadataStorage = new MetadataStorage();
