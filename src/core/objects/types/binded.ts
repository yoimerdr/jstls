import {Instanceable, Maybe, ValidateValue} from "@jstls/types/core";
import {indefinite} from "@jstls/core/utils/types";
import {bind} from "@jstls/core/functions/bind";
import {isDefined, typeIs} from "./fn";


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
export const isFunction = bind<any>(typeIs, 1, "function") as ValidateValue;

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
