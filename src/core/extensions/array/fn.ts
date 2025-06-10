import {getIf} from "@jstls/core/objects/validators/simple";
import {isDefined, isFunction} from "@jstls/core/objects/types";
import {apply} from "@jstls/core/functions/apply";
import {reduce, slice} from "@jstls/core/iterable";
import {ArrayLike} from "@jstls/types/core/array";
import {is} from "@jstls/core/polyfills/objects/es2015";
import {returns} from "@jstls/core/utils/fn";
import {Maybe} from "@jstls/types/core";
import {valueOf} from "@jstls/core/shortcuts/object";
import {RemoveArray} from "@jstls/types/core/array";
import {len} from "@jstls/core/shortcuts/indexable";
import {forEach} from "@jstls/core/shortcuts/array";
import {CountsCompareFn, Pushable} from "@jstls/types/core/extensions/array";

export function remove<R, T extends RemoveArray<R> = R[]>(source: T, value: R, ...values: R[]): boolean;
export function remove<R, T extends RemoveArray<R> = R[]>(source: T, value: R,): boolean {
  const size = len(source);
  forEach(slice(arguments, 1), value => {
    const index = source.indexOf(value)
    index > -1 && source.splice(index, 1);
  });
  return size !== len(source);
}


export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(this: I, value: T, compare?: CountsCompareFn<T, I, R>, thisArg?: R): number;
export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(value: T, compare: Maybe<CountsCompareFn<T, I, R>>, thisArg: Maybe<R>, $this: I): number;
export function counts<T, R = any, I extends ArrayLike<T> = ArrayLike<T>>(this: I, value: any, compare?: Maybe<CountsCompareFn<T, I, R>>, thisArg?: Maybe<R>, $this?: I): number {
  if (!isDefined(value)) return 0;
  value = valueOf(value);
  compare = getIf(compare, isFunction, returns(is))
  return reduce<T, number, I>((this || $this), (total, it, i, arr) => total + +apply(compare!, thisArg!, [value, it, i, arr]), 0);
}

export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[]): T;
export function extend<I, T extends Pushable<I> = Pushable<I>>(source: I[], $this: T): T;
export function extend<I, T extends Pushable<I> = Pushable<I>>(this: T, source: I[], $this?: T): T {

  $this = this || $this;
  source && apply($this.push, $this, source);
  return $this;
}

export function filterDefined<T>(this: T[]): NonNullable<T>[];
export function filterDefined<T>($this: T[]): NonNullable<T>[];
export function filterDefined<T>(this: T[], $this?: T[]): NonNullable<T>[] {
  return (this || $this).filter(isDefined) as NonNullable<T>[];
}
