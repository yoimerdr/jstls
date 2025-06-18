import {ArrayLike, ArrayLikeReduce,} from "@jstls/types/core/array";
import {prototype} from "@jstls/core/shortcuts/object";
import {binds} from "@jstls/core/functions/bind";
import {protoapply} from "@jstls/core/functions/prototype/apply";

export function slice<T extends any>(source: ArrayLike<T>, startIndex?: number, endIndex?: number): T[] {
  return protoapply(Array<any>, "slice", source, [startIndex, endIndex]);
}

const A = prototype(Array),
  reduce = binds(A.reduce) as {
    <T, A extends ArrayLike<T> = ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>): T;
    <T, A extends ArrayLike<T> = ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>, initialValue: T): T;
    <T, U, A extends ArrayLike<T> = ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A, U>, initialValue: U): U;
  },
  join = binds(A.join) as {
    <T>(source: ArrayLike<T>, separator?: string): string
  };


export {
  reduce,
  join
}
