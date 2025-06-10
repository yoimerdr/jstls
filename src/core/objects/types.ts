import {Instanceable, Maybe, Typeof, ValidateValue} from "@jstls/types/core";
import {isArray} from "@jstls/core/shortcuts/array";
import {indefinite, nullable} from "@jstls/core/utils/types";
import {bind} from "@jstls/core/functions/bind";

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


/**
 * Checks if the value is an object.
 * @param value The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export function isObject(value: any) {
  return isDefined(value) && typeIs("object", value)
}


/**
 * Checks if the value is a plain object.
 * @param value The value to check.
 * @returns True if the value is a plain object, false otherwise.
 */
export function isPlainObject(value: any) {
  return isDefined(value) && value.constructor === {}.constructor;
}

/**
 * Checks if the value is a function.
 * @param value The value to check.
 * @returns True if the value is a function, false otherwise.
 */
export const isFunction = bind<any>(typeIs, indefinite, "function") as ValidateValue;

/**
 * Checks if the value is a boolean.
 * @param value The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
export const isBoolean = bind<any>(typeIs, indefinite, "boolean") as ValidateValue;

/**
 * Checks if the value is a number.
 * @param value The value to check.
 * @returns True if the value is a number, false otherwise.
 */
export const isNumber = bind<any>(typeIs, indefinite, "number") as ValidateValue;

/**
 * Checks if the value is a string.
 * @param value The value to check.
 * @returns True if the value is a string, false otherwise.
 */
export const isString = bind<any>(typeIs, indefinite, "string") as ValidateValue;

export function isinstance(instance: Maybe<Object>, constructor: Instanceable) {
  return instance instanceof constructor;
}
