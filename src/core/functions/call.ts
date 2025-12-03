import {slice} from "@jstls/core/iterable";
import {Instanceable, InstanceableParameters, InstanceableType} from "@jstls/types/core";

/**
 * Calls a function with the specified this context and arguments.
 *
 * @example
 * const fn = () => 1;
 * call(fn); // 1
 *
 * @param fn - The function to be called.
 */
export function call<F extends (this: void) => any>(fn: F): ReturnType<F>;
/**
 * Calls a function with the specified this context and arguments.
 *
 * @example
 * const fn = function(this: { a: number }, b: number) { return this.a + b; };
 * call(fn, { a: 1 }, 2); // 3
 *
 * @param fn - The function to be called.
 * @param thisArg - The context for the function call.
 * @param args - The arguments to be passed to the function.
 */
export function call<F extends (...args: any) => any>(fn: F, thisArg: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F>;
/**
 * Calls a function with the specified this context and arguments.
 *
 * @example
 * function Person(this: any, name: string) { this.name = name; }
 * const p = {};
 * call(Person as any, p, "John");
 * console.log(p); // { name: "John" }
 *
 * @param fn - The function to be called.
 * @param thisArg - The context for the function call.
 * @param args - The arguments to be passed to the function.
 */
export function call<F extends Instanceable>(fn: F, thisArg: InstanceableType<F>, ...args: InstanceableParameters<F>): InstanceableType<F>;
export function call<F extends (...args: any) => any>(fn: F, thisArg?: ThisParameterType<F>): ReturnType<F> {
  return fn.apply(thisArg, slice(arguments, 2));
}
