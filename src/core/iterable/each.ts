import {ArrayLike, ArrayLikeEach, ArrayLikeEachNext, ArrayLikeEachPrevious} from "@jstls/types/core/array";
import {Foreachable, ForeachableEach, IterableLike, IterableLikeEach, ObjectEach} from "@jstls/types/core/iterable";
import {KeyableObject} from "@jstls/types/core/objects";
import {isFunction, isPlainObject} from "@jstls/core/objects/types";
import {bind} from "@jstls/core/functions/bind";
import {len} from "@jstls/core/shortcuts/indexable";
import {forEach} from "@jstls/core/shortcuts/array";

/**
 * Iterates over an array-like object.
 *
 * @example
 * each([1, 2, 3], (val) => console.log(val));
 *
 * @param source The array-like object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function each<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEach<T, R, I>, thisArg?: R): void;
/**
 * Iterates over a foreachable object (e.g. Set, Map).
 *
 * @example
 * each(new Set([1, 2]), (val) => console.log(val));
 *
 * @param source The foreachable object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function each<T, I extends Foreachable<T>, R = void>(source: I, each: ForeachableEach<T, R, I>, thisArg?: R): void;
/**
 * Iterates over an iterable object.
 *
 * @example
 * each('abc', (char) => console.log(char));
 *
 * @param source The iterable object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function each<T, R = void>(source: IterableLike<T> & KeyableObject, each: IterableLikeEach<T, R>, thisArg?: R): void;
/**
 * Iterates over the properties of an object.
 *
 * @example
 * each({ a: 1, b: 2 }, (val, key) => console.log(key, val));
 *
 * @param source The object to iterate over.
 * @param each The callback function to execute for each property.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function each<T, R = void>(source: T, each: ObjectEach<T, R>, thisArg?: R): void;
export function each<T, R>(source: IterableLike<T> & KeyableObject | KeyableObject, callbackfn: IterableLikeEach<T, R | void> | ObjectEach<T, R | void>, thisArg?: R): void {
  if (isFunction(source['forEach'])) {
    callbackfn = bind(callbackfn, thisArg);
    let index = 0;
    forEach(source as ArrayLike<T>, (value: T) => {
      (callbackfn as IterableLikeEach<T, R | void>)(value, index, <any>source);
      index++;
    })
  } else if (isPlainObject(source)) {
    keach(source, <any>callbackfn, thisArg);
  } else forEach(source as ArrayLike<T>, <any>callbackfn, thisArg);
}

/**
 * Iterates over the keys and values of an object.
 *
 * @example
 * keach({ a: 1, b: 2 }, (val, key) => console.log(key, val));
 *
 * @param source The object to iterate over.
 * @param each The callback function to execute for each property.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function keach<T, R = void>(source: T, each: ObjectEach<T, R>, thisArg?: R): void {
  each = bind(each, thisArg!);
  let index = 0;
  for (const key in source) {
    (each as ObjectEach<T, void>)(source[key], key, index,);
    index++;
  }
}

/**
 * Iterates over an array-like object in reverse order.
 *
 * @example
 * reach([1, 2, 3], (val) => console.log(val)); // 3, 2, 1
 *
 * @param source The array-like object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function reach<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEach<T, R, I>, thisArg?: R): void;
export function reach<T, R>(source: ArrayLike<T>, callbackfn: ArrayLikeEach<T, R | void>, thisArg?: R) {
  callbackfn = bind(callbackfn, thisArg);
  let index = len(source);
  while (index > 0) {
    --index;
    callbackfn(source[index], index, source)
  }
}

/**
 * Iterates over an array-like object, providing the current and next elements.
 *
 * @example
 * eachnxt([1, 2, 3], (curr, next) => console.log(curr, next));
 * // 1 2
 * // 2 3
 *
 * @param source The array-like object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function eachnxt<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEachNext<T, R, I>, thisArg?: R): void;
/**
 * Iterates over an array-like object, providing the current and next elements.
 *
 * @param source The array-like object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function eachnxt<T, R = void>(source: ArrayLike<T>, each: ArrayLikeEachNext<T, R>, thisArg?: R): void;
export function eachnxt<T, I extends ArrayLike<T>, R>(source: I, each: ArrayLikeEachNext<T, R | void>, thisArg?: R): void {
  each = bind(each, thisArg);
  let index = 0;
  while (index + 1 < len(source)) {
    each(source[index], source[index + 1], index, source);
    ++index;
  }
}

/**
 * Iterates over an array-like object, providing the current and previous elements.
 *
 * @example
 * eachprv([1, 2, 3], (curr, prev) => console.log(curr, prev));
 * // 3 2
 * // 2 1
 *
 * @param source The array-like object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function eachprv<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEachPrevious<T, R, I>, thisArg?: R): void;
/**
 * Iterates over an array-like object, providing the current and previous elements.
 *
 * @param source The array-like object to iterate over.
 * @param each The callback function to execute for each element.
 * @param thisArg The value to use as `this` when executing `each`.
 */
export function eachprv<T, R = void>(source: ArrayLike<T>, each: ArrayLikeEachPrevious<T, R>, thisArg?: R): void;
export function eachprv<T, I extends ArrayLike<T>, R>(source: I, each: ArrayLikeEachPrevious<T, R | void>, thisArg?: R): void {
  each = bind(each, thisArg);
  let index = len(source) - 1;
  while (index - 1 >= 0) {
    each(source[index], source[index - 1], index, source);
    --index;
  }
}
