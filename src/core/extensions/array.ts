import {readonlys} from "../definer";
import {first, firstOrNull, isEmpty, isNotEmpty, last, lastOrNull} from "./shared/iterables";
import {ArrayExtensions, ArrayWithExtensions, CountsCompareFn, Pushable} from "../../types/core/extensions/array";

import {getIf, requireDefined, requireIf} from "../objects/validators";
import {isDefined, isFunction, isObject} from "../objects/types";
import {apply} from "../functions/apply";
import {reduce} from "../iterable";
import {ArrayLike} from "../../types/core/array";


export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(this: I, value: any, compare?: CountsCompareFn<T, I, R>, thisArg?: R): number {
  requireDefined(value);
  value = value.valueOf();
  compare = getIf(compare, isFunction, () => (target, current) => target === current)
  return reduce<T, number, I>(this, (total, it, i, arr) => total + +apply(compare!, thisArg!, [value, it, i, arr]), 0);
}

export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[]): T;
export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[]): T {
  requireIf(source, isObject, "The source must be an indexable object.");
  apply(this.push, this, source);
  return this;
}

export function filterDefined<T>(this: T[]): NonNullable<T>[] {
  return this.filter(isDefined) as NonNullable<T>[];
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
