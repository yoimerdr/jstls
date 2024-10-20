import {Keys} from "../../../types/core";

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
