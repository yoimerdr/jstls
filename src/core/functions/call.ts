import {slice} from "@jstls/core/iterable";
import {Instanceable, InstanceableParameters, InstanceableType} from "@jstls/types/core";

/**
 * Calls a function with the specified this context and arguments.
 *
 * @template F - The type of the function to be called.
 * @param fn - The function to be called.
 * @returns The result of the function call.
 */
export function call<F extends (this: void) => any>(fn: F): ReturnType<F>;
/**
 * Calls a function with the specified this context and arguments.
 *
 * @template F - The type of the function to be called.
 * @param fn - The function to be called.
 * @param thisArg - The context for the function call.
 * @param args - The arguments to be passed to the function.
 * @returns The result of the function call.
 */
export function call<F extends (...args: any) => any>(fn: F, thisArg: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F>;
/**
 * Calls a function with the specified this context and arguments.
 *
 * @template F - The type of the function to be called.
 * @param fn - The function to be called.
 * @param thisArg - The context for the function call.
 * @param args - The arguments to be passed to the function.
 * @returns The result of the function call.
 */
export function call<F extends Instanceable>(fn: F, thisArg: InstanceableType<F>, ...args: InstanceableParameters<F>): InstanceableType<F>;
export function call<F extends (...args: any) => any>(fn: F, thisArg?: ThisParameterType<F>): ReturnType<F> {
  return fn.apply(thisArg, slice(arguments, 2));
}
