import {Typeof} from "@jstls/types/core";
import {isArray} from "@jstls/core/shortcuts/array";
import {indefinite, nullable} from "@jstls/core/utils/types";

/**
 * Checks if the value is of the specified type or types.
 * @param type The type or types to check for.
 * @param value The value to check.
 * @returns True if the value is of the specified type or types, false otherwise.
 */
export function typeIs<T>(type: Typeof | Typeof[], value: T): boolean {
  const typeOf = typeof value;
  return (isArray(type) ? type : [type])
    .every(type => typeOf === type);
}

/**
 * Checks if the value is defined (not undefined or null).
 * @param value The value to check.
 * @returns True if the value is defined, false otherwise.
 */
export function isDefined(value: any) {
  return value !== indefinite && value !== nullable
}
