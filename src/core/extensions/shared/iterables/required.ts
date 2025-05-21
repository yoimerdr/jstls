import {ArrayLike, ArrayLikeType} from "@/types/core/array";
import {IllegalAccessError} from "@/core/exceptions";
import {len} from "@/core/shortcuts/indexable";
import { isEmpty } from "./simple";

export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = this || $this;
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[0];
}

export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T;
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>($this: I): ArrayLikeType<I>;
export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I, $this?: I): T {
  $this = this || $this;
  if (isEmpty($this))
    throw new IllegalAccessError("The indexable object is empty.");
  return $this[len($this) - 1];
}
