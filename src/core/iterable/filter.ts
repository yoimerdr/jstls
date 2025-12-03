import {ArrayLike, ArrayLikeEach, ArrayLikeType} from "@jstls/types/core/array";
import {binds} from "@jstls/core/functions/bind";
import {prototype} from "@jstls/core/shortcuts/object";

export const filter = binds(prototype(Array).filter) as {
  /**
   * Filters an array-like object.
   *
   * @example
   * filter([1, 2, 3], (val) => val > 1); // [2, 3]
   *
   * @param source The array-like object to filter.
   * @param predicate The callback function to execute for each element.
   * @param thisArg The value to use as `this` when executing `predicate`.
   */
  <T, A extends ArrayLike<T> = ArrayLike<T>, R = void>(source: A, predicate: ArrayLikeEach<T, R, A, boolean>, thisArg?: R): ArrayLikeType<A>[];
  /**
   * Filters an array-like object.
   *
   * @param source The array-like object to filter.
   * @param predicate The callback function to execute for each element.
   * @param thisArg The value to use as `this` when executing `predicate`.
   */
  <T, R = void>(source: ArrayLike<T>, predicate: ArrayLikeEach<T, R, ArrayLike<T>, boolean>, thisArg?: R): ArrayLikeType<ArrayLike<T>>[];
}

