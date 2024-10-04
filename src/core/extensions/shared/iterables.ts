import {WithLength} from "../../../types/core/objects";
import {IllegalAccessError} from "../../exceptions";
import {Maybe} from "../../../types/core";
import {apply} from "../../functions/apply";

export function isEmpty<T extends WithLength>(this: T): boolean {
  return this.length === 0;
}

export function isNotEmpty<T extends WithLength>(this: T): boolean {
  return !apply(isEmpty, this);
}

export function first<T extends ArrayLike<any>>(this: T): any {
  if (apply(isEmpty, this))
    throw new IllegalAccessError("The indexable object is empty.");
  return this[0];
}

export function firstOrNull<T extends ArrayLike<any>>(this: T): Maybe<any> {
  return apply(isEmpty, this) ? null : this[0];
}

export function last<T extends ArrayLike<any>>(this: T): Maybe<any> {
  if (apply(isEmpty, this))
    throw new IllegalAccessError("The indexable object is empty.");
  return this[this.length - 1];
}

export function lastOrNull<T extends ArrayLike<any>>(this: T): Maybe<any> {
  return apply(isEmpty, this) ? null : this[this.length - 1];
}
