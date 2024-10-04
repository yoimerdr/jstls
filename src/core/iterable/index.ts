import {
  ArrayLike,
  ArrayLikeReduce,
} from "../../types/core/array";
import {apply} from "../functions/apply";


export function slice<T extends any>(source: ArrayLike<T>, startIndex?: number, endIndex?: number): T[] {
  return apply(Array.prototype.slice, source, [startIndex, endIndex]);
}

export function reduce<T, A extends ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>): T;
export function reduce<T, A extends ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>, initialValue: T): T;
export function reduce<T, A extends ArrayLike<T>, U>(source: A, callbackfn: ArrayLikeReduce<T, A, U>, initialValue: U): U;
export function reduce<T>(source: ArrayLike<T>, callbackfn: any, initialValue?: any): any {
  return apply(Array.prototype.reduce, source, [callbackfn, initialValue]);
}

