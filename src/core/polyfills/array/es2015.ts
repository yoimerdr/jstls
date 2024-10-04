import {IterableLike} from "../../../types/core/iterable";
import {isDefined} from "../../objects/types";
import {requireFunction} from "../../objects/validators";
import {self} from "../../utils";
import {bind} from "../../functions/bind";
import {each} from "../../iterable/each";

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

export function arrayOf<T>(...args: T[]): T[];
export function arrayOf(...args: any[]): any[];
export function arrayOf(...args: any[]): any[] {
  return args;
}
