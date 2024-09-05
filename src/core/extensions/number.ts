import {readonlys} from "../definer";
import {IllegalArgumentError} from "../exceptions";
import {NumberExtensions, NumberWithExtensions} from "../../types/core/extensions/number";

export function coerceAtLeast(this: Number, minimum: number) {
  const value = this.valueOf();
  return value < minimum ? minimum : value
}

export function coerceAtMost(this: Number, maximum: number) {
  const value = this.valueOf();
  return value > maximum ? maximum : value
}

export function coerceIn(this: Number, minimum: number, maximum: number) {
  if (minimum > maximum)
    throw new IllegalArgumentError(`Cannot coerce value to an empty range: maximum ${maximum} is less than minimum ${minimum}.`)
  const value = this.valueOf();
  return (value < minimum) ? minimum : (value > maximum) ? maximum : value
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
  readonlys<NumberWithExtensions>(Number.prototype, extensions);
}

/**
 * Apply to the Number prototype some utils extensions.
 * @see {NumberExtensions}
 */
export function applyNumberExtensions() {
  readonlys(Number.prototype, {
    coerceAtLeast,
    coerceAtMost,
    coerceIn,
    isFromTo,
    isFromUntil
  })
}
