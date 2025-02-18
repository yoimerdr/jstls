import {readonlys} from "../definer";
import {IllegalArgumentError} from "../exceptions";
import {NumberExtensions} from "../../types/core/extensions/number";
import {max, min} from "../shortcuts/math";

export function coerceAtLeast(this: Number, minimum: number) {
  return max(this.valueOf(), minimum)
}

export function coerceAtMost(this: Number, maximum: number) {
  return min(this.valueOf(), maximum)
}

export function coerceIn(this: Number, minimum: number, maximum: number) {
  if (minimum > maximum)
    throw new IllegalArgumentError(`Cannot coerce value to an empty range: maximum ${maximum} is less than minimum ${minimum}.`)
  return min(max(this.valueOf(), minimum), maximum)
}

export function isFromTo(this: Number, minimum: number, maximum: number) {
  const value = this.valueOf();
  return value >= minimum && value <= maximum;
}

export function isFromUntil(this: Number, minimum: number, maximum: number) {
  const value = this.valueOf();
  return value >= minimum && value < maximum;
}

/**
 * Apply to the Number prototype the given extensions.
 * @param extensions The extensions to apply.
 * @see {NumberExtensions}
 */
export function numberExtensions(extensions: Partial<NumberExtensions>) {
  readonlys(<any>Number.prototype, extensions);
}

/**
 * Apply to the Number prototype some utils extensions.
 * @see {NumberExtensions}
 */
export function applyNumberExtensions() {
  readonlys(<any>Number.prototype, {
    coerceAtLeast,
    coerceAtMost,
    coerceIn,
    isFromTo,
    isFromUntil
  })
}
