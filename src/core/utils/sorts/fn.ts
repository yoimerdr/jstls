import {KeyableObject} from "@jstls/types/core/objects";
import {FunctionType, Keys} from "@jstls/types/core";

export type SortFunction<T> = FunctionType<void, [a: T, b: T], number>;

export function ascsort<T extends KeyableObject, K extends Keys<T>>(key?: K): SortFunction<T>;
export function ascsort(): SortFunction<number>;
export function ascsort(key?: any) {
  return function (a: any, b: any,) {
    return key ? a[key] - b[key] : a - b;
  }
}

export function descsort<T extends KeyableObject, K extends Keys<T>>(key?: K): SortFunction<T>;
export function descsort(): SortFunction<number>;
export function descsort(key?: any) {
  return function (a: any, b: any,) {
    return key ? b[key] - a[key] : a - b;
  }
}
