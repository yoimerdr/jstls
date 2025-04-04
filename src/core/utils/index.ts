import {MaybeBoolean} from "../../types/core";
import {apply} from "../functions/apply";
import {slice} from "../iterable";
import {getDefined} from "../objects/validators";
import {nullable} from "./types";


/**
 * Executes a loop with customizable start, length, and step.
 * @param fn - The function to execute for each iteration. If it returns a truthy value, the loop breaks.
 * @param length - The number of iterations to perform.
 * @param start - The starting index of the loop. Defaults to 0.
 * @param step - The increment value for each iteration. Defaults to 1.
 *
 * @example
 * loop(function (i) {
 *   console.log(i);
 *   return i === 5; // Will break the loop when i reaches 5
 * }, 10);
 */
export function loop(fn: (index: number) => void | MaybeBoolean, length: number, start?: number, step?: number): void {
  start = getDefined(start, returns(0));
  step = getDefined(step, returns(1));

  const condition = step < 0 ? (index: number) => index > length : (index: number) => index < length;
  for (let i = start; condition(i); i += step) {
    if (fn(i))
      break;
  }
}

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

