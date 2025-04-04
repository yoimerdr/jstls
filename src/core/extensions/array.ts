import {readonlys} from "../definer";
import {first, firstOrNull, isEmpty, isNotEmpty, last, lastOrNull} from "./shared/iterables";
import {ArrayExtensions, CountsCompareFn, Pushable} from "../../types/core/extensions/array";

import {getIf, requireDefined, requireIf} from "../objects/validators";
import {isDefined, isFunction, isObject} from "../objects/types";
import {apply} from "../functions/apply";
import {reduce} from "../iterable";
import {ArrayLike} from "../../types/core/array";
import {is} from "../polyfills/objects/es2015";
import {returns} from "../utils";
import {Maybe} from "../../types/core";
import {valueOf} from "../shortcuts/object";


export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(this: I, value: T, compare?: CountsCompareFn<T, I, R>, thisArg?: R): number;
export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(value: T, compare: Maybe<CountsCompareFn<T, I, R>>, thisArg: Maybe<R>, $this: I): number;
export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(this: I, value: any, compare?: Maybe<CountsCompareFn<T, I, R>>, thisArg?: Maybe<R>, $this?: I): number {
  requireDefined(value);
  value = valueOf(value);
  compare = getIf(compare, isFunction, returns(is))
  return reduce<T, number, I>((this || $this), (total, it, i, arr) => total + +apply(compare!, thisArg!, [value, it, i, arr]), 0);
}

export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[]): T;
export function extend<I, T extends Pushable<I> = Pushable<I>>(source: I[], $this: T): T;
export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[], $this?: T): T {
  requireIf(source, isObject, "The source must be an indexable object.");
  $this = this || $this;
  apply($this.push, $this, source);
  return $this;
}

export function filterDefined<T>(this: T[]): NonNullable<T>[];
export function filterDefined<T>($this: T[]): NonNullable<T>[];
export function filterDefined<T>(this: T[], $this?: T[]): NonNullable<T>[] {
  return (this || $this).filter(isDefined) as NonNullable<T>[];
}

/**
 * Apply to the Array prototype the given extensions.
 * @param extensions The extensions to apply.
 * @see {ArrayExtensions}
 */
export function arrayExtensions(extensions: Partial<ArrayExtensions<any>>) {
  readonlys(<any>Array.prototype, extensions)
}

/**
 * Apply to the Array prototype some utils extensions.
 * @see {ArrayExtensions}
 */
export function applyArrayExtensions() {
  readonlys(<any>Array.prototype, {
    first,
    firstOrNull,
    isEmpty,
    isNotEmpty,
    last,
    lastOrNull,
    counts,
    extends: extend,
    filterDefined,
  })
}
