import {Maybe} from "../../../types/core";
import {isDefined, isFunction} from "../types";
import {apply} from "../../functions/apply";
import {returns} from "../../utils/fn";

/**
 * Calls a function with a given value and optional this context.
 *
 * @param value - The value to be passed to the function.
 * @param fn - The function to be called.
 * @param thisArg - The context for the function call.
 * @returns The result of the function call.
 */
export function letValue<V, T, R>(value: V, fn: (this: T, value: V) => R, thisArg?: T): R {
  return apply(fn, thisArg!, [value]);
}


/**
 * Calls a function if the given value is defined.
 *
 * @param value - The value to check if is defined.
 * @param fn - The function to call if the value is defined.
 * @param thisArg - The context for the function call.
 */
export function ifDefined<T, R>(value: Maybe<T>, fn: (this: R, value: NonNullable<T>) => void, thisArg?: R) {
  if (!isDefined(value))
    return;
  letValue(value!, fn, thisArg);
}

/**
 * Transforms the given object to string.
 *
 * If its no defined, use the string builder.
 * @param value The value to transforms.
 * @param nullableString The string builder.
 *
 * @see {Object.toString}
 */
export function string<T>(value: Maybe<T>, nullableString: () => string): string;
/**
 * Transforms the given object to string.
 *
 * If its no defined, use the string builder.
 * @param value The value to transforms.
 *
 * @see {Object.toString}
 */
export function string<T>(value: Maybe<T>, ): string;
export function string<T>(value: Maybe<T>, nullableString?: () => string): string {
  if (isDefined(value))
    return value!.toString();
  nullableString = isFunction(nullableString) ? nullableString! : returns("");
  return nullableString();
}
