import {Keys} from "@/types/core";
import {KeyableObject} from "@/types/core/objects";
import {len} from "@/core/shortcuts/indexable";
import {apply} from "@/core/functions/apply";
import {slice} from "@/core/iterable";
import {get} from "./getset";
import {forEach} from "@/core/shortcuts/array";
import {propertyNames} from "./properties";
import {indefinite} from "@/core/utils/types";

/**
 * Deletes the given `key` property in the target `object`, if this is defined.
 * @example
 * delete(object, 'key') // delete object['key'];
 * @param object The target object.
 * @param key The property name.
 * @return The deleted value
 */
export function deletes<T, K extends Keys<T>>(object: T, key: K): T[K];
/**
 * Deletes the given `key` (last argument) property in the target `object`, if this is defined.
 * @example
 * deletes(object, 'key', 'key2') // delete object['key']['key2'];
 * @param object The target object.
 * @param key The property name.
 * @param key2 The name of the property of the first get result.
 * @param keys The key to delete or other keys.
 * @return The deleted value
 */
export function deletes<T, K extends Keys<T>>(object: T, key: K, key2: PropertyKey, ...keys: PropertyKey[]): any;
/**
 * Deletes the given `key` property in the target `object`, if this is defined.
 * @example
 * delete(object, 'key') // delete object['key'];
 * @param object The target object.
 * @param key The property name.
 * @return The deleted value
 */
export function deletes<T>(object: T, key: PropertyKey): any;
/**
 * Deletes the given `key` (last argument) property in the target `object`, if this is defined.
 * @example
 * deletes(object, 'key', 'key2') // delete object['key']['key2'];
 * @param object The target object.
 * @param key The property name.
 * @param key2 The name of the property of the first get result.
 * @param keys The key to delete or other keys.
 * @return The deleted value
 */
export function deletes<T>(object: T, key: PropertyKey, key2: PropertyKey, ...keys: PropertyKey[]): any;
export function deletes(object: KeyableObject, key: PropertyKey): any {
  const args = arguments, lt = len(args);
  if (lt > 2) {
    object = apply(get, indefinite, slice(args, 0, lt - 1))
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
 * @param object The target object.
 * @param keys The property names.
 */
export function deletes2<T>(object: T, keys: Keys<T>[]): void;
/**
 * Deletes the given keys in the target object.
 * @param object The target object.
 * @param keys The property names.
 */
export function deletes2<T>(object: T, keys: PropertyKey[]): void;
export function deletes2<T>(object: T, keys: Keys<T>[]): void {
  forEach(keys, (key) => delete object[key]);
}

/**
 * Deletes all the keys (included non-enumerates) in the target object.
 * @param object The target object.
 */
export function deletesAll<T>(object: T,) {
  deletes2(object, propertyNames(object));
}
