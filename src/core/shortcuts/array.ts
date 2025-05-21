import {Foreachable, ForeachableEach} from "@jstls/types/core/iterable";
import {ArrayLike} from "@jstls/types/core/array";

export const isArray = Array.isArray;

export function forEach<T, This = void>(array: Foreachable<T>, callback: ForeachableEach<T, This>, thisArg?: This) {
  array.forEach(callback as any, thisArg);
}

export function clear(arr: ArrayLike) {
  arr && (arr.length = 0)
}
