import {MaybeBoolean} from "@jstls/types/core";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "./fn";

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
