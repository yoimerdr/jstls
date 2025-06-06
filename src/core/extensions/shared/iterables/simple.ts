import {WithLength} from "@jstls/types/core/objects";
import {len} from "@jstls/core/shortcuts/indexable";
import {ArrayLike, ArrayLikeType} from "@jstls/types/core/array";
import {Maybe} from "@jstls/types/core";
import {nullable} from "@jstls/core/utils/types";

export function isEmpty<T extends WithLength>(this: T): boolean;
export function isEmpty<T extends WithLength>($this: T): boolean;
export function isEmpty<T extends WithLength>(this: T, $this?: T): boolean {
  return len(this || $this) === 0;
}

export function isNotEmpty<T extends WithLength>(this: T): boolean;
export function isNotEmpty<T extends WithLength>($this: T): boolean;
export function isNotEmpty<T extends WithLength>(this: T, $this?: T): boolean {
  return !isEmpty(this || $this);
}

export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I,): Maybe<T>;
export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): Maybe<ArrayLikeType<I>>;
export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): Maybe<T> {
  $this = this || $this;
  return isEmpty($this) ? nullable : $this[0];
}

export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): Maybe<T>;
export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): Maybe<ArrayLikeType<I>>;
export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): Maybe<T> {
  $this = this || $this;
  return isEmpty($this) ? nullable : $this[len($this) - 1];
}
