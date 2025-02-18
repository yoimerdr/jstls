import {ArrayLike} from "../../types/core/array";

/**
 * Return the length of the array like object.
 *
 * This is a shortcut for length property.
 * @example
 * var size = len(arr) // arr.length
 *
 * @param iterable The array like object.
 */
export function len(iterable: ArrayLike): number {
  return iterable.length;
}
