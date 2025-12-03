import {Keys, Maybe} from "@jstls/types/core";
import {KeyableObject} from "@jstls/types/core/objects";
import {indefinite} from "@jstls/core/utils/types";
import {len} from "@jstls/core/shortcuts/indexable";
import {hasKey} from "@jstls/core/objects/handlers/properties";

/**
 * Returns the value of the `key` property in the target `object`.
 *
 * @example
 * const obj = { a: 1 };
 * get(obj, 'a'); // 1
 *
 * @param object The target object.
 * @param key The property name.
 */
export function get<T, K extends Keys<T>>(object: T, key: K): T[K];

/**
 * Returns the value of the `key` property in the target `object`.
 *
 * @example
 * const obj = { a: 1 };
 * get(obj, 'b'); // undefined
 *
 * @param object The target object.
 * @param key The target object property name.
 */
export function get<T>(object: T, key: PropertyKey): any;
/**
 * Returns the value of the nested properties in the target `object`.
 *
 * @example
 * const obj = { a: { b: 1 } };
 * get(obj, 'a', 'b'); // 1
 *
 * @param object The target object.
 * @param key The target object property name.
 * @param key2 The name of the property of the first get result.
 * @param keys The name of the properties of the previous result.
 */
export function get<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, key2: PropertyKey, ...keys: PropertyKey[]): any;
export function get<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey,): Maybe<T[K]> {
  let args = arguments, i = 1;
  if (len(args) <= 2)
    return object ? object[key] : indefinite;

  for (; i < len(args); i++) {
    key = args[i];
    if (object)
      object = object[key];
    else return object as T[K];
  }

  return object as T[K];
}

/**
 * Returns the value of the `key` property in the target `object`.
 *
 * @example
 * const obj = { a: 1 };
 * get2(obj, 'a'); // 1
 *
 * @param object The target object.
 * @param key The property name.
 */
export function get2<T, K extends Keys<T>>(object: T, key: K): Maybe<T[K]>;
/**
 * Returns the value of the `key` property in the target `object`.
 *
 * @example
 * const obj = { a: 1 };
 * get2(obj, 'b'); // undefined
 *
 * @param object The target object.
 * @param key The property name.
 */
export function get2(object: KeyableObject, key: PropertyKey): any;
export function get2<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey): Maybe<K> {
  return object ? object[key] : indefinite;
}

/**
 * Returns the value of the first existing property from the list of `keys` in the target `object`.
 *
 * @example
 * const obj = { b: 2 };
 * getfirst(obj, ['a', 'b']); // 2
 *
 * @param object The target object.
 * @param keys The list of property names to check.
 */
export function getfirst<T, K extends Keys<T>>(object: T, keys: K[]): Maybe<T[K]>;
/**
 * Returns the value of the first existing property from the list of `keys` in the target `object`.
 *
 * @example
 * const obj = { b: 2 };
 * getfirst(obj, ['a', 'c']); // undefined
 *
 * @param object The target object.
 * @param keys The list of property names to check.
 */
export function getfirst(object: KeyableObject, keys: PropertyKey[]): any;
export function getfirst<T, K extends Keys<T>>(object: T & KeyableObject, keys: K[] | PropertyKey[]): Maybe<T[K]> {
  for (let i = 0; i < len(keys); i++)
    if (hasKey(object, keys[i]))
      return object[keys[i]];

  return indefinite;
}
