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
      callbacks && forEach(callbacks, (value) => apply(<any> value, thisArg, values));
    },
    dispose() {
      apply(deletes, indefinite, <any> concat([listeners], slice(arguments)));
    },
    disposes: bind(deletesAll, indefinite, listeners)
  }
}

export const {on, off, emit, dispose, disposes} = emitter();
