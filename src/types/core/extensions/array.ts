import {Maybe} from "@jstls/types/core";

export type CountsCompareFn<T, A, R> = (this: R, target: T, current: T, index: number, arr: A) => boolean;

export type Pushable<T = any> = Record<"push", (...item: T[]) => void>;

export interface ArrayExtensions<T> {
  /**
   * Gets the first element of the array
   * @returns {T} The first element if array is not empty.
   * @template T
   * @throws {IllegalAccessError} If the array {@link isEmpty}
   */
  first(): T

  /**
   * Gets the first element of the array
   * @template T
   * @returns {Maybe<T>} The first element if array is not empty; otherwise undefined
   */
  firstOrNull(): Maybe<T>;

  /**
   * Counts how many value occurrences exist in the array.
   *
   * The default compare fn check if that values are equal with === operator.
   *
   * @param value The value for counts.
   * @param compare The compare fn. It must return true if you want to count the current item.
   * @param thisArg The this compare fn arg.
   * @returns {number} The number of occurrences
   *
   * @throws IllegalArgumentError If the param value is undefined.
   */
  counts<R>(value: T, compare?: CountsCompareFn<T, this, R>, thisArg?: R): number;

  /**
   * Check if array is empty
   *
   * @returns {boolean} true if array is empty; otherwise false
   */
  isEmpty(): boolean

  /**
   * Check if array is not empty
   * @returns {boolean} true if array is not empty; otherwise false
   */
  isNotEmpty(): boolean

  filterDefined(): NonNullable<T>[];

  /**
   * Extend current array pushing each element from source array
   * @template T
   *
   * @param {T[]} source An array with elements for extend current array.
   */
  extends(source: T[]): this;

  /**
   * Gets the last element of the array
   * @returns {Maybe<T>} The first element if array is not empty.
   * @template T
   * @throws {IllegalAccessError} If the array {@link isEmpty}
   */
  last(): T

  /**
   * Gets the last element of the array
   * @template T
   * @returns {Maybe<T>} The first element if array is not empty; otherwise undefined
   */
  lastOrNull(): Maybe<T>;

  remove(value: T, ...values: T[]): boolean;
}

export interface ArrayWithExtensions<T> extends Array<T>, ArrayExtensions<T> {}
