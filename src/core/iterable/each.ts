import {ArrayLike, ArrayLikeEach, ArrayLikeEachNext, ArrayLikeEachPrevious} from "@jstls/types/core/array";
import {Foreachable, ForeachableEach, IterableLike, IterableLikeEach, ObjectEach} from "@jstls/types/core/iterable";
import {KeyableObject} from "@jstls/types/core/objects";
import {isFunction, isPlainObject} from "@jstls/core/objects/types";
import {bind} from "@jstls/core/functions/bind";
import {len} from "@jstls/core/shortcuts/indexable";
import {forEach} from "@jstls/core/shortcuts/array";

export function each<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEach<T, R, I>, thisArg?: R): void;
export function each<T, I extends Foreachable<T>, R = void>(source: I, each: ForeachableEach<T, R, I>, thisArg?: R): void;
export function each<T, R = void>(source: IterableLike<T> & KeyableObject, each: IterableLikeEach<T, R>, thisArg?: R): void;
export function each<T, R = void>(source: T, each: ObjectEach<T, R>, thisArg?: R): void;
export function each<T, R>(source: IterableLike<T> & KeyableObject | KeyableObject, callbackfn: IterableLikeEach<T, R | void> | ObjectEach<T, R | void>, thisArg?: R): void {
  if (isFunction(source['forEach'])) {
    callbackfn = bind(callbackfn, thisArg);
    let index = 0;
    forEach(source as ArrayLike<T>, (value: T) => {
      (callbackfn as IterableLikeEach<T, R | void>)(value, index, <any>source);
      index++;
    })
  } else if (isPlainObject(source)) {
    keach(source, <any>callbackfn, thisArg);
  } else forEach(source as ArrayLike<T>, <any> callbackfn, thisArg);
}

export function keach<T, R = void>(source: T, each: ObjectEach<T, R>, thisArg?: R): void {
  each = bind(each, thisArg!);
  let index = 0;
  for (const key in source) {
    (each as ObjectEach<T, void>)(source[key], key, index,);
    index++;
  }
}

export function reach<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEach<T, R, I>, thisArg?: R): void;
export function reach<T, R>(source: ArrayLike<T>, callbackfn: ArrayLikeEach<T, R | void>, thisArg?: R) {
  callbackfn = bind(callbackfn, thisArg);
  let index = len(source);
  while (index > 0) {
    --index;
    callbackfn(source[index], index, source)
  }
}

export function eachnxt<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEachNext<T, R, I>, thisArg?: R): void;
export function eachnxt<T, R = void>(source: ArrayLike<T>, each: ArrayLikeEachNext<T, R>, thisArg?: R): void;
export function eachnxt<T, I extends ArrayLike<T>, R>(source: I, each: ArrayLikeEachNext<T, R | void>, thisArg?: R): void {
  each = bind(each, thisArg);
  let index = 0;
  while (index + 1 < len(source)) {
    each(source[index], source[index + 1], index, source);
    ++index;
  }
}

export function eachprv<T, I extends ArrayLike<T>, R = void>(source: I, each: ArrayLikeEachPrevious<T, R, I>, thisArg?: R): void;
export function eachprv<T, R = void>(source: ArrayLike<T>, each: ArrayLikeEachPrevious<T, R>, thisArg?: R): void;
export function eachprv<T, I extends ArrayLike<T>, R>(source: I, each: ArrayLikeEachPrevious<T, R | void>, thisArg?: R): void {
  each = bind(each, thisArg);
  let index = len(source) - 1;
  while (index - 1 >= 0) {
    each(source[index], source[index - 1], index, source);
    --index;
  }
}
