import {concat} from "@jstls/core/shortcuts/indexable";
import {slice} from "@jstls/core/iterable/slice";
import {apply} from "@jstls/core/functions/apply";

import {AnyFunctionType, FunctionBound, Parameter} from "@jstls/types/core";

export function bind<F extends AnyFunctionType>(fn: F,): OmitThisParameter<F>;
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>): OmitThisParameter<F>;
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>): FunctionBound<F>;
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionBound<F>;
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionBound<F>;
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>): FunctionBound<F>;
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>, arg4: Parameter<F, 3>): FunctionBound<F>;
export function bind<F extends AnyFunctionType>(fn: F, thisArg: ThisParameterType<F>, ...args: Parameters<F>): FunctionBound<F>;
/*@__NO_SIDE_EFFECTS__*/
export function bind<F extends (...args: any[]) => any>(fn: F, thisArg?: ThisParameterType<F>,): FunctionBound<F> {
  return apply(fn.bind, fn, concat([thisArg], slice(arguments, 2)) as any) as FunctionBound<F>;
}

/*@__NO_SIDE_EFFECTS__*/
export function binds<T extends (...args: any[]) => any>(fn: T): (source: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;
export function binds<T extends (...args: any[]) => any>(fn: T): (source: ThisParameterType<T>,) => ReturnType<T> {
  return function (thisArg: ThisParameterType<T>, ) {
    return apply<any>(fn, thisArg, slice(arguments, 1))
  };
}
