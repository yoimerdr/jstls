import {max, min} from "@/core/shortcuts/math";
import {valueOf} from "@/core/shortcuts/object";
import {getDefined} from "@/core/objects/validators";
import {returns} from "@/core/utils";

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
