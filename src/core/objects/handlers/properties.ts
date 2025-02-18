import {Keys} from "../../../types/core";

interface KeysShortcut {
  <T>(object: T): Keys<T>[];
}

/**
 * Returns the names of the enumerable properties and methods of an object.
 *
 * This is a short for {@link Object.keys}.
 * @param object The target object.
 * @see {Object.keys}
 */
export const keys: KeysShortcut = Object.keys;

/**
 * Returns the names of the all (including non-enumerable) properties and methods of an object.
 *
 * This is a short for {@link Object.getOwnPropertyNames}.
 *
 * @param object The target object.
 * @see {Object.getOwnPropertyNames}
 */
export const propertyNames: KeysShortcut = Object.getOwnPropertyNames;
