import 'reflect-metadata';
export declare const EVENT_LISTENER_KEY = "__RXSTACK_EVENT_LISTENER__";
/**
 * Decorator is used to mark a method as an event listener
 *
 * @param {string} eventName
 * @param {number} priority
 * @returns {MethodDecorator}
 * @constructor
 */
export declare function Observe<T>(eventName: string, priority?: number): MethodDecorator;
