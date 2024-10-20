import {AssignMode, KeyableObject} from "../../types/core/objects";
import {isDefined, isObject, isPlainObject} from "./types";
import {Entry, Maybe} from "../../types/core";
import {keys} from "./handlers/properties";
import {hasOwn} from "../polyfills/objects/es2022";
import {each} from "../iterable/each";

type AssignNoObjectFn<T> = (target: T, source: T, mode: AssignMode) => void;

function _assign<T extends Object>(target: T, source: T, mode: AssignMode, noObject?: AssignNoObjectFn<T>) {
  if (!isDefined(source))
    return;

  if (!isObject(source)) {
    if (noObject)
      noObject(target, source, mode);
    return;
  }
  each(keys(source), key => {
    if (mode === 'deep' && hasOwn(target, key)) {
      const tp = target[key] as T;
      const ts = source[key] as T;
      if (isPlainObject(tp) && isObject(ts))
        _assign(tp, ts, mode)
      else target[key] = source[key];
    } else target[key] = source[key];
  })
}

function _assignItems<T extends Object>(mode: AssignMode, target: T, source: IArguments, noObject?: AssignNoObjectFn<T>): T {
  if (!isDefined(target) || !isDefined(source))
    return target;

  for (let i = 0; i < source.length; i++)
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

export function create(...args: Object[]): KeyableObject;
export function create(): KeyableObject {
  return _assignItems("simple", {}, arguments, _createNoObjectKey);
}

export function entries(value: Maybe<KeyableObject>[]): Entry<PropertyKey>[][];
export function entries(value: Maybe<KeyableObject>): Entry<PropertyKey>[];
export function entries(value: Maybe<KeyableObject>): Entry<PropertyKey>[] | Entry<PropertyKey>[][] {
  const entry: Entry[] = [];
  if (!isDefined(value))
    return entry;

  if (isObject(value)) {
    each(keys(value!), key => {
      entry.push({
        key,
        value: isObject(value![key]) ? entries(value![key]) : value![key],
      });
    })
  } else entry.push({
    key: value!.toString(),
    value
  })
  return entry;
}
