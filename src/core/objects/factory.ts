import {AssignMode, KeyableObject} from "@jstls/types/core/objects";
import {isDefined, isObject, isPlainObject} from "./types";
import {Entry, Maybe} from "@jstls/types/core";
import {keys} from "@jstls/core/shortcuts/object";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";
import {len} from "@jstls/core/shortcuts/indexable";
import {reduce, slice} from "@jstls/core/iterable";
import {get2, setTo} from "./handlers/getset";
import {isEmpty} from "@jstls/core/extensions/shared/iterables";
import {bind} from "@jstls/core/functions/bind";
import {indefinite} from "@jstls/core/utils/types";

type AssignNoObjectFn<T> = (target: T, source: T, mode: AssignMode) => void;

export interface Assign {
  <T extends Object>(target: T, source: Partial<T>, ...sources: Partial<T>[]): T;

  <T extends Object>(target: T, source: KeyableObject, ...sources: KeyableObject[]): T;
}

function _assign<T extends Object>(target: T, source: T, mode: AssignMode, noObject?: AssignNoObjectFn<T>) {
  if (!isDefined(source))
    return;

  if (!isObject(source)) {
    noObject && noObject(target, source, mode);
    return;
  }
  return reduce(keys(source), (source, key) => {
    if (mode === 'deep' && hasOwn(target, key)) {
      const tp = get2(target, key) as T,
        ts = get2(source, key) as T;

      if (isPlainObject(tp) && isObject(ts))
        _assign(tp, ts, mode)
      else setTo(source, key, target);
    } else setTo(source, key, target);
    return source;
  }, source)
}

function _assignItems<T extends Object>(mode: AssignMode, noObject: Maybe<AssignNoObjectFn<T>>, target: T, ...sources: Object[]): T {
  const source = slice(arguments, 3);
  if (!isDefined(target) || isEmpty(source))
    return target;

  for (let i = 0; i < len(source); i++)
    _assign(target, source[i], mode, noObject!);

  return target;
}

function _createNoObjectKey(target: KeyableObject, source: Object, _: AssignMode) {
  target[source.toString()] = source;
}

/**
 * Simple object assign, with only one source object.
 * @example
 * var result = {}, source = {name: "value"};
 * assign2(result, source) // is equivalent to setTo(source, keys(source), result)
 *
 * console.log(result) // { name: "value" }
 *
 * @param target The target object
 * @param source The source object
 */
export function assign2<T extends Object>(target: T, source: Partial<T>): T {
  return isObject(source) ? setTo(source as T, keys(source), target) : target;
}

export const assign = bind(_assignItems, indefinite, "simple", indefinite) as Assign,
  deepAssign = bind(_assignItems, indefinite, "deep", indefinite) as Assign,
  create = bind(_assignItems, indefinite, "simple", _createNoObjectKey, {});

export function entries(value: Maybe<KeyableObject>[]): Entry<PropertyKey>[][];
export function entries(value: Maybe<KeyableObject>): Entry<PropertyKey>[];
export function entries(value: Maybe<KeyableObject>): Entry<PropertyKey>[] | Entry<PropertyKey>[][] {
  if (!isDefined(value))
    return [];

  if (isObject(value)) {
    return keys(value!)
      .map(key => {
        const prop = value![key];
        return {
          key,
          value: isObject(prop) ? entries(prop) : prop
        }
      });
  }
  return [
    {
      key: value!.toString(),
      value
    } as Entry
  ];
}
