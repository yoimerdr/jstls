import {reduce} from "@/core/iterable";
import {apply} from "@/core/functions/apply";
import {bind} from "@/core/functions/bind";
import {ArrayLike} from "@/types/core/array";
import {concat, len} from "@/core/shortcuts/indexable";
import {isArray} from "@/core/shortcuts/array";
import {getDefined} from "@/core/objects/validators";
import {returns} from "@/core/utils/fn";

export function flat<T>(this: ArrayLike<T>, depth?: number): T[] {
  depth = getDefined(depth, returns(1));
  return reduce(this, (arr, value) => {
    if (isArray(value) && depth! > 0)
      return concat(arr, apply(flat, value, [depth! - 1]) as T[])
    arr[len(arr)] = value;
    return arr as T[];
  }, <T[]>[]);
}


export function flatMap<T, U, A extends ArrayLike<T> = ArrayLike<T>, R = any>(this: A, callback: (this: R, value: T, index: number, array: A) => U[], thisArg?: R): U[];
export function flatMap<T, U, R>(this: ArrayLike<T>, callback: (this: R | void, value: T, index: number, array: ArrayLike<T>,) => U[], thisArg?: R): U[] {
  callback = bind(callback, thisArg)
  return reduce(this, (arr, value, index, array) => {
    const result = callback(value, index, array);
    if (isArray(result))
      return concat(arr, result);
    arr[len(arr)] = result;
    return arr;
  }, <U[]>[])
}
