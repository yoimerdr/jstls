import {FunctionType, Keys, Maybe} from "@jstls/types/core";
import {isDefined} from "@jstls/core/objects/types/fn";

export function self<T>(this: T): T {
  return this;
}

export function simple<T, K extends Keys<T> = Keys<T>>(this: T, key: K): T[K];
export function simple<T = any, R = any>(this: T, key: PropertyKey): R;
export function simple(this: any, key: any): any {
  return this[key];
}

export function mapped<T, R = any>(this: T, key: PropertyKey, mapper: (value: any) => R): R;
export function mapped<T, K extends Keys<T> = Keys<T>, R = T[K]>(this: T, key: K, mapper: (value: T[K]) => R): R;
export function mapped(this: any, key: Maybe<PropertyKey>, mapper: Maybe<FunctionType<void>>) {
  const value = isDefined(key) ? this[key!] : this;
  return mapper ? mapper(value) : value;
}
