import {ArrayLike, ArrayLikeEach, ArrayLikeReduce, ArrayLikeType} from "../../types/core/array";
import {apply, bind} from "../utils/functions";
import {KeyableObject} from "../../types/core/objects";
import {Foreachable, ForeachableEach, IterableLike, IterableLikeEach} from "../../types/core/iterable";
import {isFunction} from "../objects/types";
import {get} from "../objects/handlers";


export function slice<T extends any>(source: ArrayLike<T>, startIndex?: number, endIndex?: number): T[] {
  return apply(Array.prototype.slice, source, [startIndex, endIndex]);
}

export function filter<T extends any, R, A extends ArrayLike<T>>(source: A, predicate: ArrayLikeEach<T, R, A, boolean>, thisArg?: R): ArrayLikeType<A>[];
export function filter<T extends any, R>(source: ArrayLike<T>, predicate: ArrayLikeEach<T, R, ArrayLike<T>, unknown>, thisArg?: R): T[] {
  return apply(Array.prototype.filter, source, [predicate, thisArg]);
}


export function reduce<T, A extends ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>): T;
export function reduce<T, A extends ArrayLike<T>>(source: A, callbackfn: ArrayLikeReduce<T, A>, initialValue: T): T;
export function reduce<T, A extends ArrayLike<T>, U>(source: A, callbackfn: ArrayLikeReduce<T, A, U>, initialValue: U): U;
export function reduce<T>(source: ArrayLike<T>, callbackfn: any, initialValue?: any): any {
  return apply(Array.prototype.reduce, source, [callbackfn, initialValue]);
}

export function each<T, I extends ArrayLike<T>, R>(source: I, each: ArrayLikeEach<T, R, I>, thisArg?: R): void;
export function each<T, I extends Foreachable<T>, R>(source: I, each: ForeachableEach<T, R, I>, thisArg?: R): void;
export function each<T, R>(source: IterableLike<T> & KeyableObject, each: IterableLikeEach<T, R>, thisArg?: R): void;
export function each<T, R>(source: IterableLike<T> & KeyableObject, callbackfn: IterableLikeEach<T, R | void>, thisArg?: R): void {
  if (isFunction(get(source, 'forEach'))) {
    callbackfn = bind(callbackfn, thisArg);
    let index = 0;
    source.forEach((value: T) => {
      callbackfn(value, index, source);
      index++;
    })
  } else apply(Array.prototype.forEach, source, [<any>callbackfn, thisArg])
}

export function reach<T, I extends ArrayLike<T>, R>(source: I, each: ArrayLikeEach<T, R, I>, thisArg?: R): void;
export function reach<T, R>(source: ArrayLike<T>, callbackfn: ArrayLikeEach<T, R | void>, thisArg?: R) {
  callbackfn = bind(callbackfn, thisArg);
  let index = source.length;
  while (index > 0) {
    --index;
    callbackfn(source[index], index, source)
  }
}
