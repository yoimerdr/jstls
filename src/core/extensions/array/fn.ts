import {getDefined, getIf} from "@jstls/core/objects/validators/simple";
import {isDefined, isFunction} from "@jstls/core/objects/types";
import {apply} from "@jstls/core/functions/apply";
import {reduce, slice} from "@jstls/core/iterable";
import {ArrayLike, RemoveArray} from "@jstls/types/core/array";
import {is} from "@jstls/core/polyfills/objects/es2015";
import {returns} from "@jstls/core/utils/fn";
import {Maybe} from "@jstls/types/core";
import {valueOf} from "@jstls/core/shortcuts/object";
import {len} from "@jstls/core/shortcuts/indexable";
import {forEach} from "@jstls/core/shortcuts/array";
import {CountsCompareFn, Pushable} from "@jstls/types/core/extensions/array";

/**
 * Removes all occurrences of the specified values from the array.
 * Modifies the array in place.
 *
 * @example
 * const arr = [1, 2, 3, 2];
 * remove(arr, 2);
 * console.log(arr); // [1, 3]
 *
 * @param source The array to modify.
 * @param value The value to remove.
 * @param values Additional values to remove.
 * @returns True if the array was modified, false otherwise.
 */
export function remove<R, T extends RemoveArray<R> = R[]>(source: T, value: R, ...values: R[]): boolean;
export function remove<R, T extends RemoveArray<R> = R[]>(source: T, value: R,): boolean {
  const size = len(source);
  forEach(slice(arguments, 1), value => {
    const index = source.indexOf(value)
    index > -1 && source.splice(index, 1);
  });
  return size !== len(source);
}


/**
 * Counts the occurrences of a value in an array-like object.
 *
 * @example
 * // Using `this` context
 * const arr = [1, 2, 3, 2];
 * counts.call(arr, 2); // 2
 *
 * @param value The value to count.
 * @param compare Optional comparison function.
 * @param thisArg Optional `this` context for the comparison function.
 */
export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(this: I, value: T, compare?: CountsCompareFn<T, I, R>, thisArg?: R): number;
/**
 * Counts the occurrences of a value in an array-like object.
 *
 * @example
 * const arr = [1, 2, 3, 2];
 * counts(2, null, null, arr); // 2
 *
 * @param value The value to count.
 * @param compare Optional comparison function.
 * @param thisArg Optional `this` context for the comparison function.
 * @param $this The array-like object.
 */
export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(value: T, compare: Maybe<CountsCompareFn<T, I, R>>, thisArg: Maybe<R>, $this: I): number;
export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(this: I, value: any, compare?: Maybe<CountsCompareFn<T, I, R>>, thisArg?: Maybe<R>, $this?: I): number {
  if (!isDefined(value)) return 0;
  value = valueOf(value);
  compare = getIf(compare, isFunction, returns(is))
  $this = getDefined($this, returns(this))
  return reduce<T, number, I>($this, (total, it, i, arr) => total + +apply(compare!, thisArg!, [value, it, i, arr]), 0);
}

/**
 * Extends an array by appending elements from another array.
 * Modifies the target array in place.
 *
 * @example
 * // Using `this` context
 * const arr = [1];
 * extend.call(arr, [2, 3]);
 *
 * @param source The array containing elements to add.
 */
export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[]): T;
/**
 * Extends an array by appending elements from another array.
 * Modifies the target array in place.
 *
 * @example
 * const arr = [1];
 * extend([2, 3], arr);
 * console.log(arr); // [1, 2, 3]
 *
 * @param source The array containing elements to add.
 * @param $this The target array.
 */
export function extend<I, T extends Pushable<I> = Pushable<I>>(source: I[], $this: T): T;
export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[], $this?: T): T {
  $this = getDefined($this, returns(this));
  source && apply($this.push, $this, source);
  return $this;
}

/**
 * Filters out null and undefined values from an array.
 * Returns a new array.
 *
 * @example
 * // Using `this` context
 * const arr = [1, null, 2, undefined];
 * filterDefined.call(arr); // [1, 2]
 *
 */
export function filterDefined<T>(this: T[]): NonNullable<T>[];
/**
 * Filters out null and undefined values from an array.
 * Returns a new array.
 *
 * @example
 * const arr = [1, null, 2, undefined];
 * filterDefined(arr); // [1, 2]
 *
 * @param $this The array to filter.
 */
export function filterDefined<T>($this: T[]): NonNullable<T>[];
export function filterDefined<T>(this: T[], $this?: T[]): NonNullable<T>[] {
  return (getDefined($this, returns(this))).filter(isDefined) as NonNullable<T>[];
}
