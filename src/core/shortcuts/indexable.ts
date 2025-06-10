import {ArrayLike} from "@jstls/types/core/array";
import {isDefined} from "@jstls/core/objects/types/fn";
import {Maybe, MaybeNumber} from "@jstls/types/core";
import {Concat, IndexableType} from "@jstls/types/core/objects";
import {apply} from "@jstls/core/functions/apply";
import {slice} from "@jstls/core/iterable";
import {nullable} from "@jstls/core/utils/types";

/**
 * Return the length of the array like object.
 *
 * This is a shortcut for length property.
 * @example
 * var size = len(arr) // arr.length
 *
 * @param iterable The array like object.
 */
export function len(iterable: ArrayLike): number;
/**
 * Return the length of the array like object.
 *
 * This is a shortcut for length property.
 * @example
 * var size = len(arr) // arr.length
 *
 * @param iterable The array like object.
 */
export function len(iterable: Maybe<ArrayLike>): MaybeNumber;

export function len(iterable: Maybe<ArrayLike>): MaybeNumber {
  return isDefined(iterable) ? iterable!.length : nullable;
}

export function concat(source: string, ...others: Object[]): string;
export function concat<T extends Array<R>, R = any>(source: T, ...others: (R | ConcatArray<R>)[]): T;
export function concat<T extends Concat>(source: T, ...others: IndexableType<T>[]): T;
export function concat<T extends Concat>(source: T, ...others: IndexableType<T>[]): T {
  return apply(source.concat, source, slice(arguments, 1));
}

