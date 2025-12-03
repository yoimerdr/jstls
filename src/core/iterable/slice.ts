import {ArrayLike} from "@jstls/types/core/array";
import {protoapply} from "@jstls/core/functions/prototype/apply";

/**
 * Returns a shallow copy of a portion of an array-like object into a new array object selected from start to end (end not included).
 *
 * @example
 * slice([1, 2, 3, 4, 5], 2, 4); // [3, 4]
 *
 * @param source The array-like object to slice.
 * @param startIndex The beginning index of the specified portion of the array.
 * @param endIndex The end index of the specified portion of the array.
 */
export function slice<T extends any>(source: ArrayLike<T>, startIndex?: number, endIndex?: number): T[] {
  return protoapply(Array<any>, "slice", source, [startIndex, endIndex]);
}
