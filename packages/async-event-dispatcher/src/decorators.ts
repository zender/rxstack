import {asyncEventDispatcher} from './async-event-dispatcher';

/**
 * Decorator is used to mark a method as an event listener
 *
 * @param {string} eventName
 * @param {number} priority
 * @returns {MethodDecorator}
 * @constructor
 */
export function Observe<T>(eventName: string, priority = 0): MethodDecorator {
  return function (target: any, propertyKey: string): void {
    asyncEventDispatcher.addListener(eventName, target[propertyKey].bind(target), priority);
  };
}
