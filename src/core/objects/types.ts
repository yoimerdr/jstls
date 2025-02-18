import {Typeof} from "../../types/core";
import {isArray} from "../shortcuts/array";

/**
 * Checks if the value is of the specified type or types.
 * @param value The value to check.
 * @param type The type or types to check for.
 * @returns True if the value is of the specified type or types, false otherwise.
 */
export function typeIs<T>(value: T, type: Typeof | Typeof[]): boolean {
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
  return value !== undefined && value !== null
}


/**
 * Checks if the value is an object.
 * @param value The value to check.
 * @returns True if the value is an object, false otherwise.
 */
export function isObject(value: any) {
  return isDefined(value) && typeIs(value, "object")
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
export function isFunction(value: any) {
  return typeIs(value, "function")
}


/**
 * Checks if the value is a boolean.
 * @param value The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
export function isBoolean(value: any) {
  return typeIs(value, "boolean");
}

/**
 * Checks if the value is a number.
 * @param value The value to check.
 * @returns True if the value is a number, false otherwise.
 */
export function isNumber(value: any) {
  return typeIs(value, "number") && !isNaN(value);
  }

/**
 * Checks if the value is a string.
 * @param value The value to check.
 * @returns True if the value is a string, false otherwise.
 */
export function isString(value: any) {
  return typeIs(value, "string")
}
