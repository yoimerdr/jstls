import {Maybe, Typeof} from "@jstls/types/core";
import {IllegalArgumentError} from "@jstls/core/exceptions/illegal-argument";
import {isArray} from "@jstls/core/shortcuts/array";
import {concat} from "@jstls/core/shortcuts/string";
import {isDefined, typeIs} from "@jstls/core/objects/types";

/**
 * Checks if the value meets the given condition and returns it. If not, throws error.
 * @param value The value to checks.
 * @param condition The condition that the value must meet.
 * @param error The error string.
 * @throws {IllegalArgumentError} if the value not meets the condition.
 */
export function requireIf<T>(value: T, condition: (value: T) => boolean, error?: string): T {
  condition = requiredWithType(condition, "function", "condition");
  error = error || "The given value not meets the given condition.";
  if (!condition(value))
    throw new IllegalArgumentError(error);
  return value;
}

/**
 * Checks if the value is defined and returns it. If not, throws error.
 * @param value The value to checks.
 * @param name The value param name.
 * @throws {IllegalArgumentError} if the value is not defined.
 * @see {isDefined}
 */
export function requireDefined<T>(value: Maybe<T>, name?: string): T {
  name = name || "value";
  return requireIf(value, isDefined, concat("The given ", name, " argument must be defined."),)!;
}

/**
 * Checks if the value is of any given type. If not, throws error.
 * @param value The value to checks.
 * @param type The type, or types, that the value may be.
 * @param name The value param name.
 * @see {typeIs}
 */
export function requiredWithType<T>(value: Maybe<T>, type: Typeof | Typeof[], name?: string): T {
  name = name || "value";
  if (isArray(type)) {
    if (type.every(it => !typeIs(value, it)))
      throw new IllegalArgumentError(concat("The ", name, " argument must be be one of these types: [", type, "[]"));
  } else if (!typeIs(value, type))
    throw new IllegalArgumentError(concat("The ", name," argument must be a ", type));

  return value!;
}

/**
 * Checks if the value is a function. If not, throws error.
 * @param value The value to checks.
 * @param name The value param name.
 * @throws {IllegalArgumentError} if the value is not a function.
 */
export function requireFunction<T>(value: Maybe<T>, name?: string): T {
  return requiredWithType(value, "function", name);
}

export function requireObject<T>(value: Maybe<T>, name?: string): T {
  return requiredWithType(value, 'object', name);
}
