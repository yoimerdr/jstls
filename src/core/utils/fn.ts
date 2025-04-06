import {apply} from "../functions/apply";
import {slice} from "../iterable";
import {nullable} from "./types";


/**
 * Returns the input value unchanged.
 * @param value - The value to return.
 */
export function self<T>(value: T): T {
  return value;
}

/**
 * Creates a function that always returns the passed value.
 * @param value - The value to be returned.
 */
export function returns<T>(value: T) {
  return () => value;
}

/**
 * Creates a function that returns the negated result of the provided function.
 * @param fn - The function whose result should be negated.
 */
export function nreturns<T extends (...args: any[]) => boolean>(fn: T) {
  return function () {
    return !apply(fn, nullable!, slice(arguments) as any)
  }
}

/**
 * A no-operation function that does nothing.
 * @param args - Any arguments (which will be ignored).
 */
export function noact(...args: any) {
}

