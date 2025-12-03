import {ArrayLike, ArrayLikeType} from "@jstls/types/core/array";
import {IllegalAccessError} from "@jstls/core/exceptions";
import {len} from "@jstls/core/shortcuts/indexable";
import {isEmpty} from "./simple";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils";

/**
 * Returns the first element of the array-like object.
 * Throws an error if the object is empty.
 *
 * @example
 * const arr = [1, 2, 3];
 * console.log(first.call(arr)); // 1
 *
 */
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
/**
 * Returns the first element of the array-like object.
 * Throws an error if the object is empty.
 *
 * @example
 * const arr = [1, 2, 3];
 * console.log(first(arr)); // 1
 *
 * @param $this The array-like object.
 */
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = getDefined($this, returns(this));
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[0];
}

/**
 * Returns the last element of the array-like object.
 * Throws an error if the object is empty.
 *
 * @example
 * const arr = [1, 2, 3];
 * console.log(last.call(arr)); // 3
 *
 * // on string
 * console.log(last.call("hello")); // "o"
 *
 */
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
/**
 * Returns the last element of the array-like object.
 * Throws an error if the object is empty.
 *
 * @example
 * const arr = [1, 2, 3];
 * console.log(last(arr)); // 3
 *
 * // on string
 * console.log(last("hello")); // "o"
 *
 * @param $this The array-like object.
 */
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = getDefined($this, returns(this));
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[len($this) - 1];
}
