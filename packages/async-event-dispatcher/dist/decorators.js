"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
exports.EVENT_LISTENER_KEY = '__RXSTACK_EVENT_LISTENER__';
/**
 * Decorator is used to mark a method as an event listener
 *
 * @param {string} eventName
 * @param {number} priority
 * @returns {MethodDecorator}
 * @constructor
 */
function Observe(eventName, priority = 0) {
    return function (target, propertyKey) {
        if (!Reflect.hasMetadata(exports.EVENT_LISTENER_KEY, target.constructor)) {
            Reflect.defineMetadata(exports.EVENT_LISTENER_KEY, {
                target: target.constructor,
                observers: []
            }, target.constructor);
        }
        const metadata = Reflect.getMetadata(exports.EVENT_LISTENER_KEY, target.constructor);
        const observerMetadata = {
            eventName: eventName,
            propertyKey: propertyKey,
            priority: priority
        };
        metadata.observers.push(observerMetadata);
    };
}
exports.Observe = Observe;
//# sourceMappingURL=decorators.js.map