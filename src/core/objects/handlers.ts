import {Keys, Maybe} from "../../types/core";
import {isDefined, isFunction} from "./types";
import {apply} from "../functions/apply";
import {KeyableObject} from "../../types/core/objects";
import {hasOwn} from "../polyfills/objects/es2022";
import {each} from "../iterable/each";


/**
 * Calls a function with a given value and optional this context.
 *
 * @param value - The value to be passed to the function.
 * @param fn - The function to be called.
 * @param thisArg - The context for the function call.
 * @returns The result of the function call.
 */
export function letValue<V, T, R>(value: V, fn: (this: T, value: V) => R, thisArg?: T): R {
  return apply(fn, thisArg!, [value]);
}


/**
 * Calls a function if the given value is defined.
 *
 * @param value - The value to check if is defined.
 * @param fn - The function to call if the value is defined.
 * @param thisArg - The context for the function call.
 */
export function ifDefined<T, R>(value: Maybe<T>, fn: (this: R, value: NonNullable<T>) => void, thisArg?: R) {
  if (!isDefined(value))
    return;
  letValue(value!, fn, thisArg);
}

/**
 * Transforms the given object to string.
 *
 * If its no defined, use the string builder.
 * @param value The value to transforms.
 * @param nullableString The string builder.
 *
 * @see {Object.toString}
 */
export function string<T>(value: Maybe<T>, nullableString?: () => string): string {
  if (isDefined(value))
    return value!.toString();
  nullableString = isFunction(nullableString) ? nullableString! : () => "";
  return nullableString();
}

/**
 * Returns the names of the enumerable properties and methods of an object.
 *
 * This is a short for {@link Object.keys}.
 * @param object The target object.
 * @see {Object.keys}
 */
export function keys<T>(object: T): Keys<T>[] {
  return Object.keys(object)
}

/**
 * Returns the names of the all (including non-enumerable) properties and methods of an object.
 *
 * This is a short for {@link Object.getOwnPropertyNames}.
 *
 * @param object The target object.
 * @see {Object.getOwnPropertyNames}
 */
export function propertyNames<T>(object: T): Keys<T>[] {
  return Object.getOwnPropertyNames(object) as Keys<T>[]
}

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
export function setTo<T, K extends Keys<T>>(object: T, key: K | K[], target: T): boolean;

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
export function setTo<T, K extends Keys<T>>(object: T, key: PropertyKey | PropertyKey[], target: T): boolean;

export function setTo(object: KeyableObject, key: PropertyKey | PropertyKey[], target: KeyableObject): boolean;
export function setTo<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey | (K | PropertyKey)[], target: T & KeyableObject): boolean {
  let result = false;
  if (!Array.isArray(key))
    key = [key];

  each(key, key => {
    result = (hasOwn(object, key) ? (set(target, key, get(object, key)), true) : false);
  })
  return result;
}
