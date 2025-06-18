import {ArrayLike, ArrayLikeEach} from "@jstls/types/core/array";
import {binds} from "@jstls/core/functions/bind";
import {prototype} from "@jstls/core/shortcuts/object";

const A = Array,
  isArray = A.isArray,
  forEach = binds(prototype(A).forEach) as {
    <T, T2 = any, I extends ArrayLike<T> = ArrayLike<T>>(source: I, callback: ArrayLikeEach<T, T2, I>, thisArg?: T2): void;
  };

export function clear(arr: ArrayLike) {
  arr && (arr.length = 0)
}

export {
  isArray,
  forEach
}
