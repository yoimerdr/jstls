import {ArrayLike} from "../../types/core/array";
import {isDefined} from "../objects/types";
import {Maybe, MaybeNumber} from "../../types/core";

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
