import {Foreachable, ForeachableEach} from "@/types/core/iterable";
import {ArrayLike} from "@/types/core/array";

export const isArray = Array.isArray;

export function forEach<T, This = void>(array: Foreachable<T>, callback: ForeachableEach<T, This>, thisArg?: This) {
  array.forEach(callback as any, thisArg);
}

export function clear(arr: ArrayLike) {
  arr && (arr.length = 0)
}
