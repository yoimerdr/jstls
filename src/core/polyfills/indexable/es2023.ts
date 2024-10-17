import {isFromUntil} from "../../extensions/number";
import {ArrayEach, ArrayLike, ArrayLikeEach} from "../../../types/core/array";
import {slice} from "../../iterable";
import {Maybe} from "../../../types/core";
import {bind} from "../../functions/bind";
import {apply} from "../../functions/apply";

export function findLastIndex<V, T = any, A extends ArrayLike<V> = ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): number;
export function findLastIndex<V, T>(this: V[], predicate: ArrayEach<V, T | void, boolean>, thisArg?: T): number {
  predicate = bind(predicate, thisArg);
  let index = this.length;
  while (index > 0) {
    --index;
    if (index in this && predicate(this[index], index, this))
      return index;
  }
  return -1;
}

export function findLast<V, T = any, A extends ArrayLike<V> = ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): Maybe<V>;
export function findLast<V, T>(this: ArrayLike<V>, predicate: ArrayLikeEach<V, T | void, ArrayLike<V>, boolean>, thisArg?: T): Maybe<V> {
  predicate = bind(predicate, thisArg);
  const index = apply(findLastIndex, this, [<any>predicate, thisArg]);
  return index !== -1 ? this[index] : undefined;
}

export function toReversed<T>(this: ArrayLike<T>): T[] {
  return slice(this)
    .reverse();
}

export function toSpliced<T>(this: ArrayLike<T>, start: number, deleteCount?: number): T[];
export function toSpliced<T>(this: ArrayLike<T>, start: number, deleteCount?: number, ...items: T[]): T[];
export function toSpliced<T>(this: ArrayLike<T>, start: number, deleteCount?: number): T[] {
  const copy = slice(this);
  apply(copy.splice, copy, <any>[start, deleteCount!].concat(slice(arguments, 2)));
  return copy;
}

export function toSorted<T>(this: ArrayLike<T>, comparefn?: (a: T, b: T) => number): T[] {
  return slice(this)
    .sort(comparefn)
}

export function withItem<T>(this: ArrayLike<T>, index: number, value: T): T[] {
  let i = index >> 0;
  if (i < 0)
    i = this.length + index;
  if (!apply(isFromUntil, i, [0, this.length]))
    throw new RangeError(`Invalid index: ${index}`)
  const copy = slice(this);
  if (i in copy)
    copy[i] = value;
  return copy;
}
