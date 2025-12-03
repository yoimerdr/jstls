import {max, min} from "@jstls/core/shortcuts/math";
import {valueOf} from "@jstls/core/shortcuts/object";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils";

/**
 * Ensures that this value is not less than the specified minimum.
 *
 * @example
 * // Using `this` context
 * const val = 0;
 * coerceAtLeast.call(val, 5); // 5
 *
 * @param minimum The minimum value.
 */
export function coerceAtLeast(this: Number, minimum: number): number;
/**
 * Ensures that this value is not less than the specified minimum.
 *
 * @example
 * coerceAtLeast(5, 0); // 5
 * coerceAtLeast(5, 10); // 10
 *
 * @param minimum The minimum value.
 * @param $this The value to coerce.
 */
export function coerceAtLeast(minimum: number, $this: number): number;
export function coerceAtLeast(this: Number, minimum: number, $this?: number): number {
  return max(valueOf(getDefined($this, returns(this))), minimum)
}

/**
 * Ensures that this value is not greater than the specified maximum.
 *
 * @example
 * // Using `this` context
 * const val = 10;
 * coerceAtMost.call(val, 5); // 5
 *
 * @param maximum The maximum value.
 */
export function coerceAtMost(this: Number, maximum: number): number;
/**
 * Ensures that this value is not greater than the specified maximum.
 *
 * @example
 * coerceAtMost(5, 10); // 5
 * coerceAtMost(5, 0); // 0
 *
 * @param maximum The maximum value.
 * @param $this The value to coerce.
 */
export function coerceAtMost(maximum: number, $this: number): number;
export function coerceAtMost(this: Number, maximum: number, $this?: number): number {
  return min(valueOf(getDefined($this, returns(this))), maximum)
}

/**
 * Checks if this value is within the range [minimum, maximum].
 *
 * @example
 * // Using `this` context
 * const val = 5;
 * isFromTo.call(val, 0, 10); // true
 *
 * @param minimum The minimum value.
 * @param maximum The maximum value.
 */
export function isFromTo(this: Number, minimum: number, maximum: number): boolean;
/**
 * Checks if this value is within the range [minimum, maximum].
 *
 * @example
 * isFromTo(0, 10, 5); // true
 * isFromTo(0, 10, -1); // false
 * isFromTo(0, 10, 10); // true
 *
 * @param minimum The minimum value.
 * @param maximum The maximum value.
 * @param $this The value to check.
 */
export function isFromTo(minimum: number, maximum: number, $this: number): boolean;
export function isFromTo(this: Number, minimum: number, maximum: number, $this?: number): boolean {
  const value = valueOf(getDefined($this, returns(this)));
  return value >= minimum && value <= maximum;
}

/**
 * Checks if this value is within the range [minimum, maximum) (exclusive maximum).
 *
 * @example
 * // Using `this` context
 * const val = 5;
 * isFromUntil.call(val, 0, 10); // true
 *
 * @param minimum The minimum value.
 * @param maximum The maximum value (exclusive).
 */
export function isFromUntil(this: Number, minimum: number, maximum: number): boolean;
/**
 * Checks if this value is within the range [minimum, maximum) (exclusive maximum).
 *
 * @example
 * isFromUntil(0, 10, 5); // true
 * isFromUntil(0, 10, 10); // false
 *
 * @param minimum The minimum value.
 * @param maximum The maximum value (exclusive).
 * @param $this The value to check.
 */
export function isFromUntil(minimum: number, maximum: number, $this: number): boolean;
export function isFromUntil(this: Number, minimum: number, maximum: number, $this?: number): boolean {
  const value = valueOf(getDefined($this, returns(this)));
  return value >= minimum && value < maximum;
}
