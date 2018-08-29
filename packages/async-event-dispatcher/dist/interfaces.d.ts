import { GenericEvent } from './generic-event';
/**
 *  Function signature of an event listener
 */
export declare type EventCallable = (event: GenericEvent) => Promise<void>;
/**
 * Observer type contains event listener construction data
 */
export declare type Observer = {
    name: string;
    callable: EventCallable;
    priority?: number;
};
