import {GenericEvent} from './generic-event';

/**
 *  Function signature of and event listener
 */
export type EventCallable = (event: GenericEvent) => Promise<void>;

/**
 * Observer class contains event listener construction data
 */
export type Observer = {
  name: string;
  callable: EventCallable;
  priority?: number;
};
