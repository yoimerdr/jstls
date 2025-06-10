import {concat} from "@jstls/core/shortcuts/indexable";
import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";
import {FunctionBound, FunctionType, Parameter} from "@jstls/types/core";

export function bind<F extends FunctionType<any, any[], any>>(fn: F,): OmitThisParameter<F>;
export function bind<F extends FunctionType<any, any[], any>>(fn: F, thisArg: ThisParameterType<F>): OmitThisParameter<F>;
export function bind<F extends FunctionType<any, any[], any>>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>): FunctionBound<F>;
export function bind<F extends FunctionType<any, any[], any>>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionBound<F>;
export function bind<F extends FunctionType<any, any[], any>>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionBound<F>;
export function bind<F extends FunctionType<any, any[], any>>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>): FunctionBound<F>;
export function bind<F extends FunctionType<any, any[], any>>(fn: F, thisArg: ThisParameterType<F>, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>, arg4: Parameter<F, 3>): FunctionBound<F>;
export function bind<F extends FunctionType<any, any[], any>>(fn: F, thisArg: ThisParameterType<F>, ...args: Parameters<F>): FunctionBound<F>;
export function bind<F extends (...args: any[]) => any>(fn: F, thisArg?: ThisParameterType<F>, ...args: Parameters<F>): FunctionBound<F> {
  return apply(fn.bind, fn, concat([thisArg], slice(arguments, 2)) as any) as FunctionBound<F>;
}
