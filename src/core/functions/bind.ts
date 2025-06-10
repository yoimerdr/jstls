import {concat} from "@jstls/core/shortcuts/indexable";
import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";

export function bind<F extends (this: void) => any>(fn: F): OmitThisParameter<F>;
export function bind<F extends (...args: any[]) => any>(fn: F, thisArg: ThisParameterType<F>): OmitThisParameter<F>;
export function bind<F extends (...args: any[]) => any>(fn: F, thisArg: ThisParameterType<F>, ...args: Parameters<F>): OmitThisParameter<F>;
export function bind<F extends (...args: any[]) => any>(fn: F, thisArg?: ThisParameterType<F>, ...args: Parameters<F>): OmitThisParameter<F> {
  return apply(fn.bind, fn, concat([thisArg], slice(arguments, 2)) as any) as OmitThisParameter<F>;
}
