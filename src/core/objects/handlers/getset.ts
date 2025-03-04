import {Keys, Maybe} from "../../../types/core";
import {KeyableObject, SetToDescriptor} from "../../../types/core/objects";
import {hasOwn} from "../../polyfills/objects/es2022";
import {isArray} from "../../shortcuts/array";
import {isObject, isString} from "../types";
import {self} from "../../utils";
import {slice} from "../../iterable";
import {len} from "../../shortcuts/indexable";
import {apply} from "../../functions/apply";
import {keys} from "./properties";

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
    return object ? object[key] : undefined;

  for (; i < len(args); i++) {
    key = args[i];
    if (object)
      object = object[key];
    else return object as T[K];
  }

  return object as T[K];
}

/**
 * Sets the given value as the `key` property in the target `object`, if this is defined.
 * @example
 * set(object, 'key', value) // object['key'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param value The property value.
 * @return The new assigned value
 */
export function set<T, K extends Keys<T>>(object: T, key: K, value: T[K]): T[K];

/**
 * Sets the given value as the `key` property in the target `object`, if this is defined.
 * @example
 * set(object, 'key', value) // object['key'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param value The property value.
 * @return The new assigned value
 */
export function set<T, K extends Keys<T>, R = any>(object: T, key: PropertyKey, value: R): R;
/**
 * Sets the given value (last argument) as the `key` (second last argument) property in the target `object`, if this is defined.
 * @example
 * set(object, 'key', 'key2', value) // object['key']['key2'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param key2 The name of the property of the first get result.
 * @param keysOrValue The new value or other keys.
 * @return The new assigned value
 */
export function set<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, key2: any, ...keysOrValue: any[]): any;
export function set<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, key2: PropertyKey, ...keysOrValue: PropertyKey[]): any {
  const args = arguments, lt = len(args), value = args[lt - 1];
  if (lt > 3) {
    object = apply(get, undefined, <any>slice(args, 0, lt - 2))
    key = args[lt - 2];
  }

  if (!object)
    return undefined;

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
    for (let i = 0; i < len(key); i++) {
      const value = key[i];
      props[value] = (key as any)[value];
    }

  else if (!isObject(key))
    return target;
  else props = key as any;
  key = keys(props);
  for (let i = 0; i < len(key); i++) {
    const prop = key[i];
    if (hasOwn(object, prop))
      set(target, prop, props[prop](get(object, prop)))
  }
  return target;
}
