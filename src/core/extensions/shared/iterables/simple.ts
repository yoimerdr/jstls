import {WithLength} from "@jstls/types/core/objects";
import {len} from "@jstls/core/shortcuts/indexable";
import {ArrayLike, ArrayLikeType} from "@jstls/types/core/array";
import {Maybe} from "@jstls/types/core";
import {nullable} from "@jstls/core/utils/types";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils";

/**
 * Checks if the object has a length of 0.
 *
 * @example
 * // Using `this` context
 * isEmpty.call([]); // true
 *
 */
export function isEmpty<T extends WithLength>(this: T): boolean;
/**
 * Checks if the object has a length of 0.
 *
 * @example
 * isEmpty([]); // true
 * isEmpty([1]); // false
 * isEmpty("hello"); // false
 *
 * @param $this The object with length.
 */
export function isEmpty<T extends WithLength>($this: T): boolean;
export function isEmpty<T extends WithLength>(this: T, $this?: T): boolean {
  return len(getDefined($this, returns(this))) === 0;
}

/**
 * Checks if the object has a length greater than 0.
 *
 * @example
 * // Using `this` context
 * isNotEmpty.call([1]); // true
 *
 */
export function isNotEmpty<T extends WithLength>(this: T): boolean;
/**
 * Checks if the object has a length greater than 0.
 *
 * @example
 * isNotEmpty([]); // false
 * isNotEmpty([1]); // true
 * isNotEmpty("hello"); // true
 *
 * @param $this The object with length.
 */
export function isNotEmpty<T extends WithLength>($this: T): boolean;
export function isNotEmpty<T extends WithLength>(this: T, $this?: T): boolean {
  return !isEmpty(getDefined($this, returns(this)));
}

/**
 * Returns the first element of the array-like object, or null/undefined if empty.
 *
 * @example
 * // Using `this` context
 * firstOrNull.call([1, 2]); // 1
 *
 */
export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I,): Maybe<T>;
/**
 * Returns the first element of the array-like object, or null/undefined if empty.
 *
 * @example
 * firstOrNull([1, 2]); // 1
 * firstOrNull([]); // null
 * firstOrNull("hello"); // "h"
 *
 * @param $this The array-like object.
 */
export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): Maybe<ArrayLikeType<I>>;
export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): Maybe<T> {
  $this = getDefined($this, returns(this));
  return isEmpty($this) ? nullable : $this[0];
}

/**
 * Returns the last element of the array-like object, or null/undefined if empty.
 *
 * @example
 * // Using `this` context
 * lastOrNull.call([1, 2]); // 2
 *
 */
export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): Maybe<T>;
/**
 * Returns the last element of the array-like object, or null/undefined if empty.
 *
 * @example
 * lastOrNull([1, 2]); // 2
 * lastOrNull([]); // null
 * lastOrNull("hello"); // "o"
 *
 * @param $this The array-like object.
 */
export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): Maybe<ArrayLikeType<I>>;
export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): Maybe<T> {
  $this = getDefined($this, returns(this));
  return isEmpty($this) ? nullable : $this[len($this) - 1];
}
