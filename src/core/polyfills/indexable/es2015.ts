import {isDefined} from "../../objects/types";
import {requireFunction} from "../../objects/validators";
import {ArrayEach, ArrayLike, ArrayLikeEach} from "../../../types/core/array";
import {Maybe} from "../../../types/core";
import {bind} from "../../functions/bind";
import {apply} from "../../functions/apply";
import {max, min} from "../../shortcuts/math";
import {len} from "../../shortcuts/indexable";
import {deletes} from "../../objects/handlers/deletes";
import {indefinite} from "../../utils/types";

export function findIndex<V, T = any, A extends ArrayLike<V> = ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): number;
export function findIndex<V, T>(this: V[], predicate: ArrayEach<V, T | void, boolean>, thisArg?: T): number {
  requireFunction(predicate, "predicate");
  predicate = bind(predicate, thisArg);
  const $this = this;
  for (let i = 0; i < len($this); i++) {
    if (i in $this && predicate($this[i], i, $this))
      return i;
  }
  return -1;
}

export function find<V, T = any, A extends ArrayLike<V> = ArrayLike<V>>(this: A, predicate: ArrayLikeEach<V, T, A, boolean>, thisArg?: T): Maybe<V>;
export function find<V, T>(this: V[], predicate: ArrayEach<V, T, boolean>, thisArg?: T): Maybe<V> {
  const $this = this,
    index = apply(findIndex, $this, [predicate, thisArg]);
  return index === -1 ? indefinite : $this[index];
}


export function fill<T, A extends ArrayLike<T> = ArrayLike<T>>(this: A, value: T, start?: number, end?: number): A {
  const $this = this,
    size = len($this)
  if (!size)
    return $this;
  start = start! >> 0;
  start = start < 0 ? max(size + start, 0) : min(start, size);

  end = isDefined(end) ? end! >> 0 : size;
  end = end < 0 ? max(size + end, 0) : min(end, size)
  while (start < end) {
    $this[start] = value;
    start++;
  }
  return $this;
}

function copyWithinCheckIndex(index: number, length: number): number {
  index = index >> 0;
  return index < 0 ? max(length + index, 0) : min(index, length);
}

export function copyWithin<T, A extends ArrayLike<T> = ArrayLike<T>>(this: A, target: number, start: number, end?: number): A {
  const $this = this,
    size = len($this);
  if (!size)
    return $this;
  target = copyWithinCheckIndex(target, size);
  start = copyWithinCheckIndex(start, size);
  end = isDefined(end) ? end! : size;
  end = copyWithinCheckIndex(end, size);

  let count = min(end - start, size - target),
    direction = 1;
  if (start < target && target < (start + count)) {
    direction = -1;
    start += count - 1;
    target += count - 1;
  }

  while (count > 0) {
    if (start in $this)
      $this[target] = $this[start]
    else deletes($this, target)
    start += direction;
    target += direction;
    count--;
  }
  return $this;

}

