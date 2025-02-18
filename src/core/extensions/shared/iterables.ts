import {WithLength} from "../../../types/core/objects";
import {IllegalAccessError} from "../../exceptions";
import {Maybe} from "../../../types/core";
import {apply} from "../../functions/apply";
import {ArrayLike} from "../../../types/core/array";
import {len} from "../../shortcuts/indexable";

export function isEmpty<T extends WithLength>(this: T): boolean {
  return len(this) === 0;
}

export function isNotEmpty<T extends WithLength>(this: T): boolean {
  return !apply(isEmpty, this);
}

export function first<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T {
  if (apply(isEmpty, this))
    throw new IllegalAccessError("The indexable object is empty.");
  return this[0];
}

export function firstOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): Maybe<T> {
  return apply(isEmpty, this) ? null : this[0];
}

export function last<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): T {
  if (apply(isEmpty, this))
    throw new IllegalAccessError("The indexable object is empty.");
  return this[len(this) - 1];
}

export function lastOrNull<T, I extends ArrayLike<T> = ArrayLike<T>>(this: I): Maybe<T> {
  return apply(isEmpty, this) ? null : this[len(this) - 1];
}
