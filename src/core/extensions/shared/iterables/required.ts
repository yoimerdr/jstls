import {ArrayLike, ArrayLikeType} from "@jstls/types/core/array";
import {IllegalAccessError} from "@jstls/core/exceptions";
import {len} from "@jstls/core/shortcuts/indexable";
import {isEmpty} from "./simple";
import {getDefined} from "@jstls/core/objects/validators";
import {returns} from "@jstls/core/utils";

export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = getDefined($this, returns(this));
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[0];
}

export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = getDefined($this, returns(this));
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[len($this) - 1];
}
