import {Applicable, Instanceable, InstanceableParameters, InstanceableType,} from "@jstls/types/core";

/**
 * Applies a function with the specified this context and arguments.
 *
 * @param fn - The function to be applied.
 * @returns The result of the function application.
 */
export function apply<F extends (this: void) => any>(fn: F): ReturnType<F>;
/**
 * Applies a function with the specified this context and arguments.
 *
 * @param fn - The function to be applied.
 * @param thisArg - The context for the function application.
 * @returns The result of the function application.
 */
export function apply<F extends (...args: void[]) => any>(fn: F, thisArg: ThisParameterType<F>): ReturnType<F>;

/**
 * Applies a function with the specified this context and arguments.
 *
 * @param fn - The function to be applied.
 * @param thisArg - The context for the function application.
 * @returns The result of the function application.
 */
export function apply<F extends (...args: undefined[]) => any>(fn: F, thisArg: ThisParameterType<F>): ReturnType<F>;

/**
 * Applies a function with the specified this context and arguments.
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
 * @param fn - The function to be applied.
 * @param thisArg - The context for the function application.
 * @param args - The arguments to be passed to the function.
 * @returns The result of the function application.
 */
export function apply<F extends Instanceable>(fn: F, thisArg: InstanceableType<F>, args: InstanceableParameters<F>): InstanceableType<F>;

export function apply<F extends Applicable>(fn: F,): any;
export function apply<F extends Applicable>(fn: F, thisArg: any,): any;
export function apply<F extends Applicable>(fn: F, thisArg: any, args: any[]): any;

export function apply<F extends (...args: any) => any>(fn: F, thisArg?: ThisParameterType<F>, args?: Parameters<F>): ReturnType<F> {
  return fn.apply(thisArg, arguments[2]);
}
