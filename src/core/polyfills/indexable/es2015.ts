import {isDefined} from "../../objects/types";
import {requireFunction} from "../../objects/validators";
import {apply, bind} from "../../utils/functions";
import {ArrayEach, ArrayLike, ArrayLikeEach} from "../../../types/core/array";
import {Maybe} from "../../../types/core";

export function findIndex<V, T, A extends ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): number;
export function findIndex<V, T>(this: V[], predicate: ArrayEach<V, T | void, boolean>, thisArg?: T): number {
  requireFunction(predicate, "predicate");
  predicate = bind(predicate, thisArg)
  for (let i = 0; i < this.length; i++) {
    if (i in this && predicate(this[i], i, this))
      return i;
  }
  return -1;
}

export function find<V, T, A extends ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): Maybe<V>;
export function find<V, T>(this: V[], predicate: ArrayEach<V, T, boolean>, thisArg?: T): Maybe<V> {
  const index = apply(findIndex, this, [<any>predicate, thisArg]);
  return index === -1 ? undefined : this[index];
}


export function fill<T, A extends ArrayLike<T>>(this: A, value: T, start?: number, end?: number): A {
  if (!this.length)
    return this;
  start = start! >> 0;
  start = start < 0 ? Math.max(this.length + start, 0) : Math.min(start, this.length);

  end = isDefined(end) ? end! >> 0 : this.length;
  end = end < 0 ? Math.max(this.length + end, 0) : Math.min(end, this.length)
  while (start < end) {
    this[start] = value;
    start++;
  }
  return this;
}

function copyWithinCheckIndex(index: number, length: number): number {
  index = index >> 0;
  return index < 0 ? Math.max(length + index, 0) : Math.min(index, length);
}

export function copyWithin<T, A extends ArrayLike<T>>(this: A, target: number, start: number, end?: number): A {
  if (!this.length)
    return this;
  target = copyWithinCheckIndex(target, this.length);
  start = copyWithinCheckIndex(start, this.length);
  end = isDefined(end) ? end! : this.length;
  end = copyWithinCheckIndex(end, this.length);

  let count = Math.min(end - start, this.length - target);
  let direction = 1;
  if (start < target && target < (start + count)) {
    direction = -1;
    start += count - 1;
    target += count - 1;
  }

  while (count > 0) {
    if (start in this)
      this[target] = this[start]
    else delete this[target]
    start += direction;
    target += direction;
    count--;
  }
  return this;

}

