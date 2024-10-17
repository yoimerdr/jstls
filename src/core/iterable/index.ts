import {ArrayLike, ArrayLikeReduce,} from "../../types/core/array";
import {protoapply} from "../functions/prototype";


export function slice<T extends any>(source: ArrayLike<T>, startIndex?: number, endIndex?: number): T[] {
  return protoapply(Array<any>, "slice", source, [startIndex, endIndex]);
}

export function reduce<T, A extends ArrayLike<T> = ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>): T;
export function reduce<T, A extends ArrayLike<T> = ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>, initialValue: T): T;
export function reduce<T, U, A extends ArrayLike<T> = ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A, U>, initialValue: U): U;
export function reduce<T>(source: ArrayLike<T>, callbackfn: any, initialValue?: any): any {
  return protoapply(Array, "reduce", source, [callbackfn, initialValue]);
}

export function join<T>(source: ArrayLike<T>, separator?: string): string {
  return protoapply(Array,"join", source, [separator])
}
