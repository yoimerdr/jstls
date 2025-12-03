import {concat} from "@jstls/core/shortcuts/indexable";
import {slice} from "@jstls/core/iterable/slice";
import {apply} from "@jstls/core/functions/apply";
import {AnyFunctionType, FunctionBound, Parameter} from "@jstls/types/core";

/**
 * Creates a new function that, when called, has its `this` keyword set to undefined.
 *
 * @example
 * const fn = function() { return this; };
 * const bound = bind(fn);
 *
 * @param fn The function to bind.
 */
export function bind<F extends AnyFunctionType>(fn: F,): OmitThisParameter<F>;
/**
 * Creates a new function that, when called, has its `this` keyword set to the provided value.
 *
 * @example
 * const fn = function() { return this.a; };
 * const bound = bind(fn, { a: 1 });
 * bound(); // 1
 *
 * @param fn The function to bind.
 * @param thisArg The value to be passed as the `this` parameter to the target function.
 */
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>): OmitThisParameter<F>;
/**
 * Creates a new function that, when called, has its `this` keyword set to the provided value,
 * with a given sequence of arguments preceding any provided when the new function is called.
 *
 * @example
 * const fn = function(a) { return this.val + a; };
 * const bound = bind(fn, { val: 10 }, 5);
 * bound(); // 15
 *
 * @param fn The function to bind.
 * @param thisArg The value to be passed as the `this` parameter to the target function.
 * @param arg1 The first argument to pre-fill.
 */
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>): FunctionBound<F>;
/**
 * Creates a new function that, when called, has its `this` keyword set to the provided value,
 * with a given sequence of arguments preceding any provided when the new function is called.
 *
 * @example
 * const fn = function(a, b) { return this.val + a + b; };
 * const bound = bind(fn, { val: 10 }, 5, 2);
 * bound(); // 17
 *
 * @param fn The function to bind.
 * @param thisArg The value to be passed as the `this` parameter to the target function.
 * @param arg1 The first argument to pre-fill.
 * @param arg2 The second argument to pre-fill.
 */
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionBound<F>;
/**
 * Creates a new function that, when called, has its `this` keyword set to the provided value,
 * with a given sequence of arguments preceding any provided when the new function is called.
 *
 * @param fn The function to bind.
 * @param thisArg The value to be passed as the `this` parameter to the target function.
 * @param arg1 The first argument to pre-fill.
 * @param arg2 The second argument to pre-fill.
 */
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionBound<F>;
/**
 * Creates a new function that, when called, has its `this` keyword set to the provided value,
 * with a given sequence of arguments preceding any provided when the new function is called.
 *
 * @param fn The function to bind.
 * @param thisArg The value to be passed as the `this` parameter to the target function.
 * @param arg1 The first argument to pre-fill.
 * @param arg2 The second argument to pre-fill.
 * @param arg3 The third argument to pre-fill.
 */
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>): FunctionBound<F>;
/**
 * Creates a new function that, when called, has its `this` keyword set to the provided value,
 * with a given sequence of arguments preceding any provided when the new function is called.
 *
 * @param fn The function to bind.
 * @param thisArg The value to be passed as the `this` parameter to the target function.
 * @param arg1 The first argument to pre-fill.
 * @param arg2 The second argument to pre-fill.
 * @param arg3 The third argument to pre-fill.
 * @param arg4 The fourth argument to pre-fill.
 */
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>, arg4: Parameter<F, 3>): FunctionBound<F>;
/**
 * Creates a new function that, when called, has its `this` keyword set to the provided value,
 * with a given sequence of arguments preceding any provided when the new function is called.
 *
 * @example
 * const fn = function(...args) { return this.val + args.reduce((a, b) => a + b, 0); };
 * const bound = bind(fn, { val: 10 }, 1, 2, 3);
 * bound(); // 16
 *
 * @param fn The function to bind.
 * @param thisArg The value to be passed as the `this` parameter to the target function.
 * @param args The arguments to pre-fill.
 */
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, ...args: Parameters<F>): FunctionBound<F>;
/*@__NO_SIDE_EFFECTS__*/
export function bind<F extends (...args: any[]) => any>(fn: F, thisArg?: ThisParameterType<F>,): FunctionBound<F> {
  return apply(fn.bind, fn, concat([thisArg], slice(arguments, 2)) as any) as FunctionBound<F>;
}

/**
 * Creates a function that invokes the original function with `this` provided as the first argument.
 *
 * @example
 * const fn = function() { return this.a; };
 * const binder = binds(fn);
 * binder({ a: 1 }); // 1
 *
 * @param fn The function to wrap.
 */
export function binds<T extends (...args: any[]) => any>(fn: T): (source: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;
/*@__NO_SIDE_EFFECTS__*/
export function binds<T extends (...args: any[]) => any>(fn: T): (source: ThisParameterType<T>,) => ReturnType<T> {
  return function (thisArg: ThisParameterType<T>,) {
    return apply<any>(fn, thisArg, slice(arguments, 1))
  };
}
