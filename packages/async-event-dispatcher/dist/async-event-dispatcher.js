"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const generic_event_1 = require("./generic-event");
/**
 * The AsyncEventDispatcher
 */
class AsyncEventDispatcher {
    constructor() {
        /**
         * Holds all events and its listeners
         *
         * @type {Map<any, any>}
         */
        this.stack = new Map();
    }
    /**
     * Adds an event listener that listens on the specified events.
     *
     * @param {string} eventName
     * @param {EventCallable} callable
     * @param {number} priority
     */
    addListener(eventName, callable, priority = 0) {
        this.getNamedStack(eventName).push({ name: eventName, callable: callable, priority: priority });
    }
    /**
     * Gets the listeners of a specific event sorted by descending priority.
     *
     * @param {string} eventName
     * @returns {EventCallable[]}
     */
    getListeners(eventName) {
        const listeners = this.getNamedStack(eventName);
        return listeners
            .sort((a, b) => a.priority - b.priority)
            .map((item) => item.callable);
    }
    /**
     * Checks whether an event has any registered listeners.
     *
     * @param {string} eventName
     * @returns {boolean}
     */
    hasListeners(eventName) {
        return this.getListeners(eventName).length > 0;
    }
    /**
     *  Removes event listeners from the specified event.
     *
     * @param {string} eventName
     */
    removeListeners(eventName) {
        this.stack.delete(eventName);
    }
    /**
     * Removes all event listeners
     */
    reset() {
        this.stack.clear();
    }
    /**
     * Dispatches an event to all registered listeners.
     *
     * @param {string} eventName
     * @param {GenericEvent} event
     * @returns {Promise<GenericEvent>}
     */
    dispatch(eventName, event) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!event)
                event = new generic_event_1.GenericEvent();
            const listeners = this.getListeners(eventName);
            if (listeners.length > 0)
                yield this.doDispatch(listeners, event);
            return event;
        });
    }
    /**
     * Gets a stack of a particular event
     *
     * @param {string} name
     * @returns {Observer[]}
     */
    getNamedStack(name) {
        if (!this.stack.has(name)) {
            this.stack.set(name, []);
        }
        return this.stack.get(name);
    }
    /**
     * Triggers the listeners of an event.
     *
     * @param {EventCallable[]} listeners
     * @param {GenericEvent} event
     * @returns {Promise<GenericEvent>}
     */
    doDispatch(listeners, event) {
        return __awaiter(this, void 0, void 0, function* () {
            return listeners.reduce((currrent, next) => {
                return currrent.then(() => __awaiter(this, void 0, void 0, function* () {
                    if (event.isPropagationStopped()) {
                        return event;
                    }
                    return next.call(this, event);
                }));
            }, Promise.resolve(event));
        });
    }
}
exports.AsyncEventDispatcher = AsyncEventDispatcher;
/**
 * Exports single instance of AsyncEventDispatcher
 *
 * @type {AsyncEventDispatcher}
 */
exports.asyncEventDispatcher = new AsyncEventDispatcher();
//# sourceMappingURL=async-event-dispatcher.js.map