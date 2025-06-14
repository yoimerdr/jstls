import {KeyableObject} from "@jstls/types/core/objects";
import {FunctionType, Keys} from "@jstls/types/core";
import {isDefined} from "@jstls/core/objects/types/fn";

export type SortFunction<T> = FunctionType<void, [a: T, b: T], number>;

export function ascsort<T extends KeyableObject, K extends Keys<T>>(key?: K): SortFunction<T>;
export function ascsort(): SortFunction<number>;
export function ascsort(key?: any) {
  return isDefined(key) ? (a: any, b: any,) => (a[key] - b[key])
    : (a: number, b: number) => (a - b);
}

export function descsort<T extends KeyableObject, K extends Keys<T>>(key?: K): SortFunction<T>;
export function descsort(): SortFunction<number>;
export function descsort(key?: any) {
  return isDefined(key) ? (a: any, b: any,) => (b[key] - a[key])
    : (a: number, b: number) => (b - a);
}
