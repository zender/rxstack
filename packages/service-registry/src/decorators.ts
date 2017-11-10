import {metadataStorage} from './metadata-storage';

/**
 * Decorator is used to add a class metadata
 *
 * @param {string} ns
 * @param {string} name
 * @param {number} priority
 * @returns {ClassDecorator}
 * @constructor
 */
export function ServiceRegistry<T>(ns: string, name: string, priority = 0): ClassDecorator {
  return function (target: Function): void {
    metadataStorage.add({
      'ns': ns,
      'name': name,
      'priority': priority,
      'target': target
    });
  };
}
