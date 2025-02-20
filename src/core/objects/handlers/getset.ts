import {Keys, Maybe} from "../../../types/core";
import {KeyableObject, SetToDescriptor} from "../../../types/core/objects";
import {hasOwn} from "../../polyfills/objects/es2022";
import {forEach, isArray} from "../../shortcuts/array";
import {isObject, isString} from "../types";
import {self} from "../../utils";
import {keys} from "./properties";
import {reduce} from "../../iterable";

/**
 * Returns the value of the `key` property in the target `object`.
 * @example
 * const value = get(object, 'key') // object[key]
 * @param object The target object.
 * @param key The property name.
 */
export function get<T, K extends Keys<T>>(object: T, key: K): T[K];

/**
 * Returns the value of the `key` property in the target `object`.
 * @example
 * const value = get(object, 'key') // object['key'];
 * @param object The target object.
 * @param key The target object property name.
 */
export function get<T>(object: T, key: PropertyKey): any;
export function get<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey): Maybe<T[K]> {
  return object[key]
}

/**
 * Sets the given value as the `key` property in the target `object`.
 * @example
 * set(object, 'key', value) // object['key'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param value The property value.
 * @return The new assigned value
 */
export function set<T, K extends Keys<T>>(object: T, key: K, value: T[K]): T[K];

/**
 * Sets the given value as the `key` property in the target `object`.
 * @example
 * set(object, 'key', value) // object['key'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param value The property value.
 * @return The new assigned value
 */
export function set<T, K extends Keys<T>, R = any>(object: T, key: PropertyKey, value: R): R;
export function set<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, value: Maybe<T[K]>): Maybe<T[K]> {
  object[key] = value;
  return object[key];
}

/**
 * Sets the value of the `key` property in the source `object` to the `target` object.
 * @example
 * setTo(object, 'key', target) // target['key'] = object['key'];
 * @example
 * setTo(object, ['key', 'name'], target) // target['key'] = object['key']; target['name'] = object['name'];
 * @param object The source object.
 * @param key The property name.
 * @param target The target object.
 * @return True if the property value has been assigned, false otherwise.
 */
export function setTo<T, K extends Keys<T>>(object: T, key: K | K[], target: T): T;

/**
 * Sets the value of the `key` property in the source `object` to the `target` object.
 * @example
 * setTo(object, 'key', target) // target['key'] = object['key'];
 * @example
 * setTo(object, ['key', 'name'], target) // target['key'] = object['key']; target['name'] = object['name'];
 * @param object The source object.
 * @param key The property name.
 * @param target The target object.
 * @return True if the property value has been assigned, false otherwise.
 */
export function setTo<T, K extends Keys<T>>(object: T, key: PropertyKey | PropertyKey[], target: T): T;

export function setTo<T, R = KeyableObject>(object: T, key: SetToDescriptor<T>, target: Partial<R>): R;

export function setTo(object: KeyableObject, key: PropertyKey | PropertyKey[], target: KeyableObject): KeyableObject;
export function setTo<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey | (K | PropertyKey)[], target: T & KeyableObject): KeyableObject {
  let props: KeyableObject = {};
  if (isString(key)) {
    props[key as string] = self;
  } else if (isArray(key))
    props = reduce(key, (source, value) => {
      source[value] = (key as any)[value];
      return source;
    }, props)
  else if (!isObject(key))
    return target;
  else props = key as any;
  forEach(keys(props), key => {
    if (hasOwn(object, key)) {
      set(target, key, props[key](get(object, key)));
    }
  })
  return target;
}
