import {AssignMode, KeyableObject} from "@jstls/types/core/objects";
import {isDefined, isObject, isPlainObject} from "./types";
import {Entry, Maybe} from "@jstls/types/core";
import {keys} from "@jstls/core/shortcuts/object";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";
import {len} from "@jstls/core/shortcuts/indexable";
import {reduce} from "@jstls/core/iterable";
import {get2, setTo} from "./handlers/getset";

type AssignNoObjectFn<T> = (target: T, source: T, mode: AssignMode) => void;

function _assign<T extends Object>(target: T, source: T, mode: AssignMode, noObject?: AssignNoObjectFn<T>) {
  if (!isDefined(source))
    return;

  if (!isObject(source)) {
    noObject && noObject(target, source, mode);
    return;
  }
  return reduce(keys(source), (source, key) => {
    if (mode === 'deep' && hasOwn(target, key)) {
      const tp = get2(target, key) as T;
      const ts = get2(source, key) as T;
      if (isPlainObject(tp) && isObject(ts))
        _assign(tp, ts, mode)
      else setTo(source, key, target);
    } else setTo(source, key, target);
    return source;
  }, source)
}

function _assignItems<T extends Object>(mode: AssignMode, target: T, source: IArguments, noObject?: AssignNoObjectFn<T>): T {
  if (!isDefined(target) || !isDefined(source))
    return target;

  for (let i = 0; i < len(source); i++)
    _assign(target, source[i], mode, noObject);

  return target;
}

export function assign<T extends Object>(target: T, ...source: Partial<T>[]): T;
export function assign<T extends Object>(target: T): T {
  return _assignItems("simple", target, arguments);
}

export function deepAssign<T extends Object>(target: T, ...source: Partial<T>[]): T;
export function deepAssign<T extends Object>(target: T): T {
  return _assignItems("deep", target, arguments);
}

function _createNoObjectKey(target: KeyableObject, source: Object, mode: AssignMode) {
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

export function create(...args: Object[]): KeyableObject;
export function create(): KeyableObject {
  return _assignItems("simple", {}, arguments, _createNoObjectKey);
}

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
