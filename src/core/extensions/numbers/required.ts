import {IllegalArgumentError} from "@/core/exceptions";
import {concat} from "@/core/shortcuts/indexable";
import {max, min} from "@/core/shortcuts/math";
import {valueOf} from "@/core/shortcuts/object";
import {getDefined} from "@/core/objects/validators";
import {returns} from "@/core/utils";

export function coerceIn(this: Number, minimum: number, maximum: number): number;
export function coerceIn(minimum: number, maximum: number, $this: number): number;
export function coerceIn(this: Number, minimum: number, maximum: number, $this?: number): number {
  if (minimum > maximum)
    throw new IllegalArgumentError(concat("Cannot coerce value to an empty range: maximum '", maximum, "' is less than minimum '", minimum, "'"))
  return min(max(valueOf(getDefined(this, returns($this!))), minimum), maximum)
}
