import {KeyableObject} from "@jstls/types/core/objects";
import {get2, set} from "./objects/handlers/getset";
import {forEach} from "./shortcuts/array";
import {slice} from "./iterable";
import {apply} from "./functions/apply";
import {isFunction} from "./objects/types";
import {deletes, deletesAll} from "./objects/handlers/deletes";
import {indefinite} from "./utils/types";
import {concat} from "./shortcuts/indexable";
import {bind} from "@jstls/core/functions/bind";

export interface Emitter {
  /**
   * Adds a listener for the specified event.
   *
   * @example
   * emitter.on('event', () => console.log('fired'));
   *
   * @param name The event name.
   * @param listener The callback function.
   */
  on(name: string, listener: Function): void;

  /**
   * Emits an event with the specified arguments.
   *
   * @example
   * emitter.emit('event', null, 1, 2);
   *
   * @param name The event name.
   * @param thisArg The `this` context for the listener.
   * @param args The arguments to pass to the listener.
   */
  emit(name: string, thisArg?: any, ...args: any[]): void;

  /**
   * Removes a listener for the specified event.
   *
   * @example
   * emitter.off('event', listener);
   *
   * @param name The event name.
   * @param listener The callback function to remove.
   */
  off(name: string, listener: Function): void;

  /**
   * Disposes of the specified events.
   *
   * @example
   * emitter.dispose('event1', 'event2');
   *
   * @param name The first event name to dispose.
   * @param names Additional event names to dispose.
   */
  dispose(name: string, ...names: string[]): void;

  /**
   * Disposes of all events.
   *
   * @example
   * emitter.disposes();
   */
  disposes(): void;
}

/**
 * Creates a new event emitter.
 *
 * @example
 * const myEmitter = emitter();
 * myEmitter.on('test', () => console.log('test'));
 * myEmitter.emit('test');
 */
export function emitter(): Emitter {
  const listeners: KeyableObject<Array<Function>> = {};

  return {
    on(name, listener) {
      if (isFunction(listener)) {
        (get2(listeners, name) || set(listeners, name, []))
          .push(listener);
      }
    },
    off(name, listener) {
      const callbacks = get2(listeners, name);
      callbacks && callbacks.splice(callbacks.indexOf(listener), 1);
    },
    emit(name, thisArg) {
      const callbacks = get2(listeners, name),
        values = slice(arguments, 2);
      callbacks && forEach(callbacks, (value) => apply(<any>value, thisArg, values));
    },
    dispose() {
      apply(deletes, indefinite, <any>concat([listeners], slice(arguments)));
    },
    disposes: bind(deletesAll, indefinite, listeners)
  }
}

/**
 * Global event emitter instance methods.
 */
export const {on, off, emit, dispose, disposes} = emitter();
