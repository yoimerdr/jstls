import {IllegalArgumentError} from "@jstls/core/exceptions";
import {concat} from "@jstls/core/shortcuts/indexable";
import {max, min} from "@jstls/core/shortcuts/math";
import {valueOf} from "@jstls/core/shortcuts/object";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils";

/**
 * Ensures that this value lies in the specified range [minimum, maximum].
 *
 * @example
 * // Using `this` context
 * const val = 10;
 * coerceIn.call(val, 0, 5); // 5
 *
 * @param minimum The minimum value.
 * @param maximum The maximum value.
 */
export function coerceIn(this: Number, minimum: number, maximum: number): number;
/**
 * Ensures that this value lies in the specified range [minimum, maximum].
 *
 * @example
 * coerceIn(0, 5, 10); // 5
 * coerceIn(0, 5, -1); // 0
 * coerceIn(0, 5, 3); // 3
 *
 * @param minimum The minimum value.
 * @param maximum The maximum value.
 * @param $this The value to coerce.
 */
export function coerceIn(minimum: number, maximum: number, $this: number): number;
export function coerceIn(this: Number, minimum: number, maximum: number, $this?: number): number {
  if (minimum > maximum)
    throw new IllegalArgumentError(concat("Cannot coerce value to an empty range: maximum '", maximum, "' is less than minimum '", minimum, "'"))
  return min(max(valueOf(getDefined($this, returns(this))), minimum), maximum)
}
