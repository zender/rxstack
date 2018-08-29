import { GenericEvent } from './generic-event';
import { EventCallable } from './interfaces';
/**
 * The AsyncEventDispatcher
 */
export declare class AsyncEventDispatcher {
    /**
     * Holds all events and its listeners
     *
     * @type {Map<any, any>}
     */
    private stack;
    /**
     * Adds an event listener that listens on the specified events.
     *
     * @param {string} eventName
     * @param {EventCallable} callable
     * @param {number} priority
     */
    addListener(eventName: string, callable: EventCallable, priority?: number): void;
    /**
     * Gets the listeners of a specific event sorted by descending priority.
     *
     * @param {string} eventName
     * @returns {EventCallable[]}
     */
    getListeners(eventName: string): EventCallable[];
    /**
     * Checks whether an event has any registered listeners.
     *
     * @param {string} eventName
     * @returns {boolean}
     */
    hasListeners(eventName: string): boolean;
    /**
     *  Removes event listeners from the specified event.
     *
     * @param {string} eventName
     */
    removeListeners(eventName: string): void;
    /**
     * Removes all event listeners
     */
    reset(): void;
    /**
     * Dispatches an event to all registered listeners.
     *
     * @param {string} eventName
     * @param {GenericEvent} event
     * @returns {Promise<GenericEvent>}
     */
    dispatch(eventName: string, event?: GenericEvent): Promise<GenericEvent>;
    /**
     * Gets a stack of a particular event
     *
     * @param {string} name
     * @returns {Observer[]}
     */
    private getNamedStack;
    /**
     * Triggers the listeners of an event.
     *
     * @param {EventCallable[]} listeners
     * @param {GenericEvent} event
     * @returns {Promise<GenericEvent>}
     */
    private doDispatch;
}
/**
 * Exports single instance of AsyncEventDispatcher
 *
 * @type {AsyncEventDispatcher}
 */
export declare const asyncEventDispatcher: AsyncEventDispatcher;
