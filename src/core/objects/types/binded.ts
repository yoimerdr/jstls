import {ValidateValue} from "@jstls/types/core";
import {indefinite} from "@jstls/core/utils/types";
import {bind} from "@jstls/core/functions/bind";
import {typeIs} from "./fn";

/**
 * Checks if the value is a function.
 * @param value The value to check.
 * @returns True if the value is a function, false otherwise.
 */
export const isFunction = bind(typeIs, indefinite, "function") as ValidateValue,

/**
 * Checks if the value is a boolean.
 * @param value The value to check.
 * @returns True if the value is a boolean, false otherwise.
 */
isBoolean = bind(typeIs, indefinite, "boolean") as ValidateValue,

/**
 * Checks if the value is a number.
 * @param value The value to check.
 * @returns True if the value is a number, false otherwise.
 */
isNumber = bind(typeIs, indefinite, "number") as ValidateValue,

/**
 * Checks if the value is a string.
 * @param value The value to check.
 * @returns True if the value is a string, false otherwise.
 */
isString = bind(typeIs, indefinite, "string") as ValidateValue;
