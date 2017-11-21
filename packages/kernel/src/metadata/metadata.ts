import {MethodDefinition} from '../interfaces';
import {ControllerOptions} from './controller-options';

export class ControllerMetadata {
  public options?: ControllerOptions;
  public methodDefinitions: Map<string, MethodDefinition> = new Map();
  constructor(public target: Function) {
    this.options = new ControllerOptions();
  }
}
