import {isFromUntil} from "@/core/extensions/number";
import {ArrayEach, ArrayLike, ArrayLikeEach} from "@/types/core/array";
import {slice} from "@/core/iterable";
import {Maybe} from "@/types/core";
import {bind} from "@/core/functions/bind";
import {apply} from "@/core/functions/apply";
import {len} from "@/core/shortcuts/indexable";
import {concat} from "@/core/shortcuts/string";
import {indefinite} from "@/core/utils/types";

export function findLastIndex<V, T = any, A extends ArrayLike<V> = ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): number;
export function findLastIndex<V, T>(this: V[], predicate: ArrayEach<V, T | void, boolean>, thisArg?: T): number {
  predicate = bind(predicate, thisArg);
  const $this = this;
  let index = len($this);
  while (index > 0) {
    --index;
    if (index in $this && predicate($this[index], index, $this))
      return index;
  }
  return -1;
}

export function findLast<V, T = any, A extends ArrayLike<V> = ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): Maybe<V>;
export function findLast<V, T>(this: ArrayLike<V>, predicate: ArrayLikeEach<V, T | void, ArrayLike<V>, boolean>, thisArg?: T): Maybe<V> {
  predicate = bind(predicate, thisArg);
  const $this = this,
    index = apply(findLastIndex, $this, [predicate, thisArg]);
  return index !== -1 ? $this[index] : indefinite;
}

export function toReversed<T>(this: ArrayLike<T>): T[] {
  return slice(this)
    .reverse();
}

export function toSpliced<T>(this: ArrayLike<T>, start: number, deleteCount?: number): T[];
export function toSpliced<T>(this: ArrayLike<T>, start: number, deleteCount?: number, ...items: T[]): T[];
export function toSpliced<T>(this: ArrayLike<T>, start: number, deleteCount?: number): T[] {
  const copy = slice(this);
  apply(copy.splice, copy, concat([start, deleteCount!], slice(arguments, 2)));
  return copy;
}

export function toSorted<T>(this: ArrayLike<T>, comparefn?: (a: T, b: T) => number): T[] {
  return slice(this)
    .sort(comparefn)
}

export function withItem<T>(this: ArrayLike<T>, index: number, value: T): T[] {
  let i = index >> 0;
  const $this = this;
  i < 0 && (i = len($this) + index);
  if (!isFromUntil(0, len($this), i,))
    throw new RangeError(concat("Invalid index: ", index))
  const copy = slice($this);
  (i in copy) && (copy[i] = value);
  return copy;
}
