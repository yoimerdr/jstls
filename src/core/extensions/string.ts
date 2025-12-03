import {readonlys} from "@jstls/core/definer";
import {StringExtensions} from "@jstls/types/core/extensions/string";
import {MaybeNumber} from "@jstls/types/core";
import {isEmpty, isNotEmpty} from "./shared/iterables";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils/fn";
import {nullable} from "@jstls/core/utils/types";


/**
 * Converts a string or number to an integer.
 * Returns null if the conversion fails (NaN).
 *
 * @example
 * // Using `this` context
 * toInt.call("123", 10); // 123
 *
 * @param radix The radix for parsing.
 */
export function toInt(this: string | number, radix?: number): MaybeNumber;
/**
 * Converts a string or number to an integer.
 * Returns null if the conversion fails (NaN).
 *
 * @example
 * toInt(10, "123"); // 123
 * toInt(10, "abc"); // null
 *
 * @param radix The radix for parsing.
 * @param $this The value to convert.
 */
export function toInt(radix: MaybeNumber, $this: string | number): MaybeNumber;
export function toInt(this: string | number, radix?: MaybeNumber, $this?: string | number): MaybeNumber {
  const value = parseInt(<string>(getDefined($this, returns(this))), radix!);
  return isNaN(value) ? nullable : value
}

/**
 * Converts a string or number to a float.
 * Returns null if the conversion fails (NaN).
 *
 * @example
 * // Using `this` context
 * toFloat.call("123.45"); // 123.45
 *
 */
export function toFloat(this: string | number): MaybeNumber;
/**
 * Converts a string or number to a float.
 * Returns null if the conversion fails (NaN).
 *
 * @example
 * toFloat("123.45"); // 123.45
 * toFloat("abc"); // null
 *
 * @param $this The value to convert.
 */
export function toFloat($this: string | number): MaybeNumber;
export function toFloat(this: string | number, $this?: string | number): MaybeNumber {
  const value = parseFloat(<string>(getDefined($this, returns(this))));
  return isNaN(value) ? nullable : value
}

/**
 * Apply to the String prototype some utils extensions.
 * @see {StringExtensions}
 */
export function applyStringExtensions() {
  readonlys(<any>String.prototype, {
    isEmpty,
    isNotEmpty,
    toInt,
    toFloat
  })
}

/**
 * Apply to the String prototype the given extensions.
 * @param extensions The extensions to apply.
 * @see {StringExtensions}
 */
export function stringExtensions(extensions: Partial<StringExtensions>) {
  readonlys(<any>String.prototype, extensions);
}
