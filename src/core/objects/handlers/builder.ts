import {KeyableObject} from "@jstls/types/core/objects";
import {Keys, MethodKeys} from "@jstls/types/core";

/*@__NO_SIDE_EFFECTS__*/
export function caller<T extends KeyableObject, K extends MethodKeys<T> = MethodKeys<T>>(key: K) {
  return function (object: T) {
    return object[key]();
  }
}

/*@__NO_SIDE_EFFECTS__*/
export function property<T extends KeyableObject, K extends Keys<T> = Keys<T>>(key: K): (object: T) => T[K] {
  return function (object: T) {
    return object[key];
  }
}
