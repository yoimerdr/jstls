import {IterableLike} from "@jstls/types/core/iterable";
import {isDefined} from "@jstls/core/objects/types";
import {requireFunction} from "@jstls/core/objects/validators";
import {self} from "@jstls/core/utils";
import {bind} from "@jstls/core/functions/bind";
import {each} from "@jstls/core/iterable/each";
import {slice} from "@jstls/core/iterable";

export function arrayFrom<T>(iterable: IterableLike<T>): T[];
export function arrayFrom<T, U, R>(iterable: IterableLike<T>, mapfn: (this: R, value: T, index: number) => U, thisArg?: any): U[];
export function arrayFrom<T, U, R>(iterable: IterableLike<T>, mapfn?: (this: R | void, v: T, k: number) => U | T, thisArg?: R): (U | T)[] {
  if (isDefined(mapfn))
    requireFunction(mapfn, "mapfn");
  else mapfn = self

  const result: (U | T)[] = [];
  mapfn = bind(mapfn!, thisArg);
  each(iterable, function (value, index) {
    this[index] = mapfn!(value, index)
  }, result)
  return result;
}

export function entries<T>(this: T[]): [number, T][] {
  return this.map((value, index) => [index, value]);
}

export function arrayOf<T>(...args: T[]): T[];
export function arrayOf(...args: any[]): any[];
export function arrayOf(...args: any[]): any[] {
  return slice(arguments);
}
