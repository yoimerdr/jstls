import {FunctionType, Maybe, Nullables} from "@/types/core";
import {isDefined} from "@/core/objects/types";

export function self<T>(): (this: T) => T {
  return function () {
    return this;
  }
}

export function simple<T = any>(): (this: T) => T;
export function simple<T = any, R = any>(key: PropertyKey): (this: T) => R;
export function simple<T = any, R = any>(key?: PropertyKey): (this: T) => R | T {
  return isDefined(key) ? function (this: any): R {
    return this[key!];
  } : self();
}

export function mapped<T = any, R = any, R2 = any>(key: PropertyKey, mapper: FunctionType<void, [value: R], R2>): (this: T) => R2;
export function mapped<T = any, R2 = any>(key: Nullables, mapper: FunctionType<void, [value: T], R2>): (this: T) => R2;
export function mapped<T = any, R = any, R2 = any>(key?: Maybe<PropertyKey>, mapper?: FunctionType<void, [value: R], R2>): (this: T) => R2 | T {
  return isDefined(key) ? function (this: any) {
    const value = this[key!];
    return mapper ? mapper(value) : value;
  } : self();
}
