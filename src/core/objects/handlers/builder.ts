import {KeyableObject} from "@jstls/types/core/objects";
import {Keys, MethodKeys} from "@jstls/types/core";

/**
 * Creates a function that calls the method `key` on the given object.
 *
 * @example
 * const obj = { a: () => 1 };
 * const callA = caller('a');
 * callA(obj); // 1
 *
 * @param key The method name.
 */
/*@__NO_SIDE_EFFECTS__*/
export function caller<T extends KeyableObject, K extends MethodKeys<T> = MethodKeys<T>>(key: K) {
  return function (object: T) {
    return object[key]();
  }
}

/**
 * Creates a function that returns the property `key` from the given object.
 *
 * @example
 * const obj = { a: 1 };
 * const getA = property('a');
 * getA(obj); // 1
 *
 * @param key The property name.
 */
/*@__NO_SIDE_EFFECTS__*/
export function property<T extends KeyableObject, K extends Keys<T> = Keys<T>>(key: K): (object: T) => T[K] {
  return function (object: T) {
    return object[key];
  }
}
