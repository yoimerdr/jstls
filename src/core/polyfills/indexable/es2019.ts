import {getDefined} from "../../objects/validators";
import {reduce} from "../../iterable";
import {apply} from "../../functions/apply";
import {bind} from "../../functions/bind";

export function flat<T>(this: ArrayLike<T>, depth?: number): T[] {
  depth = getDefined(depth, () => 1);
  return reduce(this, (arr, value) => {
    if (Array.isArray(value) && depth! > 0)
      return arr.concat(apply(flat, value, [depth! - 1]) as T[])
    arr[arr.length] = value;
    return arr as T[];
  }, <T[]>[]);
}


export function flatMap<T, U, A extends ArrayLike<T>, R>(this: A, callback: (this: R, value: T, index: number, array: A) => U[], thisArg?: R): U[];
export function flatMap<T, U, R>(this: ArrayLike<T>, callback: (this: R | void, value: T, index: number, array: ArrayLike<T>,) => U[], thisArg?: R): U[] {
  callback = bind(callback, thisArg)
  return reduce(this, (arr, value, index, array) => {
    const result = callback(value, index, array);
    if (Array.isArray(result))
      return arr.concat(result);
    arr[arr.length] = result;
    return arr;
  }, <U[]>[])
}
