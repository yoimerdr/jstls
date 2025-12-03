import {Keys} from "@jstls/types/core";
import {KeyableObject} from "@jstls/types/core/objects";
import {len} from "@jstls/core/shortcuts/indexable";
import {apply} from "@jstls/core/functions/apply";
import {slice} from "@jstls/core/iterable";
import {get} from "./getset";
import {forEach} from "@jstls/core/shortcuts/array";
import {propertyNames} from "./properties";
import {indefinite} from "@jstls/core/utils/types";

/**
 * Deletes the given `key` property in the target `object`.
 *
 * @example
 * const obj = { a: 1 };
 * deletes(obj, 'a'); // 1
 *
 * @param object The target object.
 * @param key The property name.
 */
export function deletes<T, K extends Keys<T>>(object: T, key: K): T[K];
/**
 * Deletes the given `key` (last argument) property in the target `object`.
 *
 * @example
 * const obj = { a: { b: 1 } };
 * deletes(obj, 'a', 'b'); // 1
 *
 * @param object The target object.
 * @param key The property name.
 * @param key2 The name of the property of the first get result.
 * @param keys The key to delete or other keys.
 */
export function deletes<T, K extends Keys<T>>(object: T, key: K, key2: PropertyKey, ...keys: PropertyKey[]): any;
/**
 * Deletes the given `key` property in the target `object`.
 *
 * @example
 * const obj = { a: 1 };
 * deletes(obj, 'b'); // undefined
 *
 * @param object The target object.
 * @param key The property name.
 */
export function deletes<T>(object: T, key: PropertyKey): any;
/**
 * Deletes the given `key` (last argument) property in the target `object`.
 *
 * @example
 * const obj = { a: { b: 1 } };
 * deletes(obj, 'a', 'b'); // 1
 *
 * @param object The target object.
 * @param key The property name.
 * @param key2 The name of the property of the first get result.
 * @param keys The key to delete or other keys.
 */
export function deletes<T>(object: T, key: PropertyKey, key2: PropertyKey, ...keys: PropertyKey[]): any;
export function deletes(object: KeyableObject, key: PropertyKey): any {
  const args = arguments, lt = len(args);
  if (lt > 2) {
    object = apply(get, indefinite, <any>slice(args, 0, lt - 1))
    key = args[lt - 1];
  }

  if (!object)
    return indefinite;

  const value = object[key];
  delete object[key];
  return value;
}

/**
 * Deletes the given keys in the target object.
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * deletes2(obj, ['a']); // obj is { b: 2 }
 *
 * @param object The target object.
 * @param keys The property names.
 */
export function deletes2<T>(object: T, keys: Keys<T>[]): void;
/**
 * Deletes the given keys in the target object.
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * deletes2(obj, ['b']); // obj is { a: 1 }
 *
 * @param object The target object.
 * @param keys The property names.
 */
export function deletes2<T>(object: T, keys: PropertyKey[]): void;
export function deletes2<T>(object: T, keys: Keys<T>[]): void {
  forEach(keys, (key) => delete object[key]);
}

/**
 * Deletes all the keys (included non-enumerates) in the target object.
 *
 * @example
 * const obj = { a: 1 };
 * deletesAll(obj); // obj is {}
 *
 * @param object The target object.
 */
export function deletesAll<T>(object: T,) {
  deletes2(object, propertyNames(object));
}
