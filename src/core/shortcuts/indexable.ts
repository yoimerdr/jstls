import {ArrayLike} from "../../types/core/array";
import {isDefined} from "../objects/types";
import {Maybe, MaybeNumber} from "../../types/core";
import {Concat, IndexableType} from "../../types/core/objects";
import {apply} from "../functions/apply";
import {slice} from "../iterable";

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
  return isDefined(iterable) ? iterable!.length : null;
}

export function concat(source: string, ...others: Object[]): string;
export function concat<T extends Array<T>, R = any>(source: T, ...others: (R | ConcatArray<R>)[]): T;
export function concat<T extends Concat>(source: T, ...others: IndexableType<T>[]): T;
export function concat<T extends Concat>(source: T, ...others: IndexableType<T>[]): T {
  return apply(source.concat, source, slice(arguments, 1));
}

