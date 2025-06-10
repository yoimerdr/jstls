import {FunctionPartial, FunctionType, Parameter} from "@jstls/types/core";
import {apply} from "@jstls/core/functions/apply";
import {slice} from "@jstls/core/iterable";
import {concat} from "@jstls/core/shortcuts/indexable";

export function partial<F extends FunctionType<any, any[], any>>(fn: F,): FunctionPartial<F>;
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>): FunctionPartial<F>;
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionPartial<F>;
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>, arg2: Parameter<F, 1>): FunctionPartial<F>;
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>): FunctionPartial<F>;
export function partial<F extends FunctionType<any, any[], any>>(fn: F, arg1: Parameter<F>, arg2: Parameter<F, 1>, arg3: Parameter<F, 2>, arg4: Parameter<F, 3>): FunctionPartial<F>;
export function partial<F extends FunctionType<any, any[], any>>(fn: F, ...args: Parameters<F>): FunctionPartial<F>;
export function partial<F extends FunctionType<any, any[], any>>(fn: F, ...args: Parameters<F>) {
  const source = slice(arguments, 1);
  return function (this: ThisParameterType<F>, ...args: any[]): any {
    return apply<any>(fn, this, concat(source, slice(arguments)))
  }
}
