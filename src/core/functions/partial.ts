import {FunctionPartial, FunctionType, Parameter} from "@jstls/types/core";
import {apply} from "@jstls/core/functions/apply";
import {slice} from "@jstls/core/iterable";
import {concat} from "@jstls/core/shortcuts/indexable";

/**
 * Partially applies arguments to a function.
 *
 * @example
 * const add = (a, b) => a + b;
 * const partialAdd = partial(add);
 * partialAdd(1, 2); // 3
 *
 * @example
 * // Using `this` context
 * const obj = { val: 10 };
 * const add = function(a) { return this.val + a; };
 * const partialAdd = partial(add);
 * partialAdd.call(obj, 5); // 15
 *
 * @param fn The function to partially apply.
 */
export function partial<F extends FunctionType<any, any[], any>>(fn: F,): FunctionPartial<F>;
/**
 * Partially applies arguments to a function.
 *
 * @example
 * const add = (a, b) => a + b;
 * const partialAdd = partial(add, 5);
 * partialAdd(10); // 15
 *
 * @example
 * // Using `this` context
 * const obj = { val: 10 };
 * const add = function(a, b) { return this.val + a + b; };
 * const partialAdd = partial(add, 5);
 * partialAdd.call(obj, 10); // 25
 *
 * @param fn The function to partially apply.
 * @param arg1 The first argument to pre-fill.
 */
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>): FunctionPartial<F>;
/**
 * Partially applies arguments to a function.
 *
 * @param fn The function to partially apply.
 * @param arg1 The first argument to pre-fill.
 * @param arg2 The second argument to pre-fill.
 */
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionPartial<F>;
/**
 * Partially applies arguments to a function.
 *
 * @param fn The function to partially apply.
 * @param arg1 The first argument to pre-fill.
 * @param arg2 The second argument to pre-fill.
 * @param arg3 The third argument to pre-fill.
 */
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>): FunctionPartial<F>;
/**
 * Partially applies arguments to a function.
 *
 * @param fn The function to partially apply.
 * @param arg1 The first argument to pre-fill.
 * @param arg2 The second argument to pre-fill.
 * @param arg3 The third argument to pre-fill.
 * @param arg4 The fourth argument to pre-fill.
 */
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>, arg4: Parameter<F, 3>): FunctionPartial<F>;
/**
 * Partially applies arguments to a function.
 *
 * @example
 * const sum = (...args) => args.reduce((a, b) => a + b, 0);
 * const partialSum = partial(sum, 10);
 * partialSum(1, 2, 3); // 16
 *
 * @example
 * // Using `this` context
 * const obj = { val: 10 };
 * const sum = function(...args) { return this.val + args.reduce((a, b) => a + b, 0); };
 * const partialSum = partial(sum, 5);
 * partialSum.call(obj, 1, 2, 3); // 21
 *
 * @param fn The function to partially apply.
 * @param args The arguments to pre-fill.
 */
export function partial<F extends FunctionType<any, any[], any>>(fn: F, ...args: Parameters<F>): FunctionPartial<F>;
/*@__NO_SIDE_EFFECTS__*/
export function partial<F extends FunctionType<any, any[], any>>(fn: F) {
  const source = slice(arguments, 1);
  return function (this: ThisParameterType<F>): any {
    return apply<any>(fn, this, concat(source, slice(arguments)))
  }
}
