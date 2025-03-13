import {Foreachable, ForeachableEach} from "../../types/core/iterable";
import {set} from "../objects/handlers/getset";

export const isArray = Array.isArray;

export function forEach<T, This = void>(array: Foreachable<T>, callback: ForeachableEach<T, This>, thisArg?: This) {
  array.forEach(callback as any, thisArg);
}

export function clear<T>(arr: ArrayLike<T>) {
  set(arr, "length", 0)
}
