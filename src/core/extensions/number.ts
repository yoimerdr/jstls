import {readonlys} from "../definer";
import {IllegalArgumentError} from "../exceptions";
import {NumberExtensions} from "../../types/core/extensions/number";
import {max, min} from "../shortcuts/math";
import {concat} from "../shortcuts/string";
import {getDefined} from "../objects/validators";
import {returns} from "../utils/fn";
import {valueOf} from "../shortcuts/object";

export function coerceAtLeast(this: Number, minimum: number): number;
export function coerceAtLeast(minimum: number, $this: number): number;
export function coerceAtLeast(this: Number, minimum: number, $this?: number): number {
  return max(valueOf(getDefined(this, returns($this!))), minimum)
}

export function coerceAtMost(this: Number, maximum: number): number;
export function coerceAtMost(maximum: number, $this: number): number;
export function coerceAtMost(this: Number, maximum: number, $this?: number): number {
  return min(valueOf(getDefined(this, returns($this!))), maximum)
}

export function coerceIn(this: Number, minimum: number, maximum: number): number;
export function coerceIn(minimum: number, maximum: number, $this: number): number;
export function coerceIn(this: Number, minimum: number, maximum: number, $this?: number): number {
  if (minimum > maximum)
    throw new IllegalArgumentError(concat("Cannot coerce value to an empty range: maximum '", maximum, "' is less than minimum '", minimum, "'"))
  return min(max(valueOf(getDefined(this, returns($this!))), minimum), maximum)
}

export function isFromTo(this: Number, minimum: number, maximum: number): boolean;
export function isFromTo(minimum: number, maximum: number, $this: number): boolean;
export function isFromTo(this: Number, minimum: number, maximum: number, $this?: number): boolean {
  const value = valueOf(getDefined(this, returns($this!)));
  return value >= minimum && value <= maximum;
}

export function isFromUntil(this: Number, minimum: number, maximum: number): boolean;
export function isFromUntil(minimum: number, maximum: number, $this: number): boolean;
export function isFromUntil(this: Number, minimum: number, maximum: number, $this?: number): boolean {
  const value = valueOf(getDefined(this, returns($this!)));
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
