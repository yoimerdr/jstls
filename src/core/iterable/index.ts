import {ArrayLike, ArrayLikeReduce,} from "@jstls/types/core/array";
import {prototype} from "@jstls/core/shortcuts/object";
import {binds} from "@jstls/core/functions/bind";
export {slice} from "./slice";

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
