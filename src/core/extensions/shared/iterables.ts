import {WithLength} from "@/types/core/objects";
import {IllegalAccessError} from "@/core/exceptions/illegal-access";
import {Maybe} from "@/types/core";
import {ArrayLike, ArrayLikeType} from "@/types/core/array";
import {len} from "@/core/shortcuts/indexable";
import {nullable} from "@/core/utils/types";

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

export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = this || $this;
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[0];
}

export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I,): Maybe<T>;
export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): Maybe<ArrayLikeType<I>>;
export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): Maybe<T> {
  $this = this || $this;
  return isEmpty($this) ? nullable : $this[0];
}

export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = this || $this;
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[len($this) - 1];
}

export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): Maybe<T>;
export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): Maybe<ArrayLikeType<I>>;
export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): Maybe<T> {
  $this = this || $this;
  return isEmpty($this) ? nullable : $this[len($this) - 1];
}
