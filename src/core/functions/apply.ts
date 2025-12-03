import {Instanceable, InstanceableParameters, InstanceableType,} from "@jstls/types/core";

/**
 * Applies a function with the specified this context and arguments.
 *
 * @example
 * const fn = () => 1;
 * apply(fn); // 1
 *
 * @param fn - The function to be applied.
 * @returns The result of the function application.
 */
export function apply<F extends (this: void) => any>(fn: F): ReturnType<F>;
/**
 * Applies a function with the specified this context and arguments.
 *
 * @example
 * const fn = function() { return this.a; };
 * apply(fn, { a: 1 }); // 1
 *
 * @param fn - The function to be applied.
 * @param thisArg - The context for the function application.
 * @returns The result of the function application.
 */
export function apply<F extends (...args: void[]) => any>(fn: F, thisArg: ThisParameterType<F>): ReturnType<F>;

/**
 * Applies a function with the specified this context and arguments.
 *
 * @example
 * const fn = function() { return this.a; };
 * apply(fn, { a: 1 }); // 1
 *
 * @param fn - The function to be applied.
 * @param thisArg - The context for the function application.
 * @returns The result of the function application.
 */
export function apply<F extends (...args: undefined[]) => any>(fn: F, thisArg: ThisParameterType<F>): ReturnType<F>;

/**
 * Applies a function with the specified this context and arguments.
 *
 * @example
 * const fn = function(b: number) { return this.a + b; };
 * apply(fn, { a: 1 }, [2]); // 3
 *
 * @param fn - The function to be applied.
 * @param thisArg - The context for the function application.
 * @param args - The arguments to be passed to the function.
 * @returns The result of the function application.
 */
export function apply<F extends (...args: any[]) => any>(fn: F, thisArg: ThisParameterType<F>, args: Parameters<F>): ReturnType<F>;

/**
 * Applies a function with the specified this context and arguments.
 *
 * @example
 * function Person(name: string) { this.name = name; }
 * const p = {};
 * apply(Person, p, ["John"]);
 * console.log(p); // { name: "John" }
 *
 * @param fn - The function to be applied.
 * @param thisArg - The context for the function application.
 * @param args - The arguments to be passed to the function.
 * @returns The result of the function application.
 */
export function apply<F extends Instanceable>(fn: F, thisArg: InstanceableType<F>, args: InstanceableParameters<F>): InstanceableType<F>;

export function apply<F extends (...args: any) => any>(fn: F, thisArg?: ThisParameterType<F>, args?: Parameters<F>): ReturnType<F> {
  return fn.apply(thisArg, arguments[2]);
}
