import {KeyableObject} from "@jstls/types/core/objects";
import {FunctionType, Keys} from "@jstls/types/core";
import {isDefined} from "@jstls/core/objects/types/fn";

export type SortFunction<T> = FunctionType<void, [a: T, b: T], number>;

/**
 * Creates a comparator function for sorting objects in ascending order by a specific key.
 *
 * @example
 * const arr = [{ val: 2 }, { val: 1 }];
 * arr.sort(ascsort('val')); // [{ val: 1 }, { val: 2 }]
 *
 * @param key The key to sort by.
 */
export function ascsort<T extends KeyableObject, K extends Keys<T>>(key?: K): SortFunction<T>;
/**
 * Creates a comparator function for sorting numbers in ascending order.
 *
 * @example
 * const arr = [2, 1, 3];
 * arr.sort(ascsort()); // [1, 2, 3]
 */
export function ascsort(): SortFunction<number>;
export function ascsort(key?: any) {
  return isDefined(key) ? (a: any, b: any,) => (a[key] - b[key])
    : (a: number, b: number) => (a - b);
}

/**
 * Creates a comparator function for sorting objects in descending order by a specific key.
 *
 * @example
 * const arr = [{ val: 1 }, { val: 2 }];
 * arr.sort(descsort('val')); // [{ val: 2 }, { val: 1 }]
 *
 * @param key The key to sort by.
 */
export function descsort<T extends KeyableObject, K extends Keys<T>>(key?: K): SortFunction<T>;
/**
 * Creates a comparator function for sorting numbers in descending order.
 *
 * @example
 * const arr = [1, 2, 3];
 * arr.sort(descsort()); // [3, 2, 1]
 */
export function descsort(): SortFunction<number>;
export function descsort(key?: any) {
  return isDefined(key) ? (a: any, b: any,) => (b[key] - a[key])
    : (a: number, b: number) => (b - a);
}
