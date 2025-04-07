import {Keys, Maybe} from "../../../../types/core";
import {KeyableObject} from "../../../../types/core/objects";
import {indefinite} from "../../../utils/types";
import {len} from "../../../shortcuts/indexable";

/**
 * Returns the value of the `key` property in the target `object`, if this is defined.
 * @example
 * const value = get(object, 'key') // object[key]
 * @param object The target object.
 * @param key The property name.
 * @return The property value, or undefined if is not present or object not is an object.
 */
export function get<T, K extends Keys<T>>(object: T, key: K): T[K];

/**
 * Returns the value of the `key` property in the target `object`, if this is defined.
 * @example
 * const value = get(object, 'key') // object['key'];
 * @param object The target object.
 * @param key The target object property name.
 * @return The property value, or undefined if is not present or object not is an object.
 */
export function get<T>(object: T, key: PropertyKey): any;
/**
 * Returns the value of the `key` property in the target `object`, if this is defined.
 * @example
 * const value = get(object, 'key', 'key2') // object['key']['key2'];
 * @param object The target object.
 * @param key The target object property name.
 * @param key2 The name of the property of the first get result.
 * @param keys The name of the properties of the previous result.
 * @return The last property value, or undefined if is not present or some object not is an object.
 */
export function get<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, key2: PropertyKey, ...keys: PropertyKey[]): any;
export function get<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, ...keys: PropertyKey[]): Maybe<T[K]> {
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
