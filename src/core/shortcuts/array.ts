import {Foreachable, ForeachableEach} from "../../types/core/iterable";

export const isArray = Array.isArray;

export function forEach<T,This = void>(array: Foreachable<T>, callback: ForeachableEach<T, This>, thisArg?: This) {
  array.forEach(callback as any, thisArg);
}
