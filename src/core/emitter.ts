import {KeyableObject} from "../types/core/objects";
import {get, set} from "./objects/handlers/getset";
import {forEach} from "./shortcuts/array";
import {slice} from "./iterable";
import {apply} from "./functions/apply";
import {isFunction} from "./objects/types";
import {deletes, deletesAll} from "./objects/handlers/deletes";
import {indefinite} from "./utils/types";
import {concat} from "./shortcuts/indexable";

export interface Emitter {
  on(name: string, listener: Function): void;

  emit(name: string, thisArg?: any, ...args: any[]): void;

  off(name: string, listener: Function): void;

  dispose(name: string, ...names: string[]): void;

  disposes(): void;
}

export function emitter(): Emitter {
  const listeners: KeyableObject<Array<Function>> = {};

  return {
    on(name, listener) {
      if (isFunction(listener)) {
        (get(listeners, name) || set(listeners, name, []))
          .push(listener);
      }
    },
    off(name, listener) {
      const callbacks = get(listeners, name);
      callbacks && callbacks.splice(callbacks.indexOf(listener), 1);
    },
    emit(name, thisArg) {
      const callbacks = get(listeners, name),
        values = slice(arguments, 2);
      callbacks && forEach(callbacks, (value) => apply(value, thisArg, values));
    },
    dispose() {
      apply(deletes, indefinite, concat([listeners], slice(arguments)));
    },
    disposes() {
      deletesAll(listeners);
    }
  }
}

export const {on, off, emit, dispose, disposes} = emitter();
