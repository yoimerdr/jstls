import {Keys, Maybe} from "@jstls/types/core";
import {KeyableObject, SetToDescriptor} from "@jstls/types/core/objects";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";
import {isArray} from "@jstls/core/shortcuts/array";
import {isDefined, isObject, isString} from "@jstls/core/objects/types";
import {self} from "@jstls/core/utils/fn";
import {indefinite} from "@jstls/core/utils/types";
import {reduce, slice} from "@jstls/core/iterable";
import {len} from "@jstls/core/shortcuts/indexable";
import {apply} from "@jstls/core/functions/apply";
import {keys} from "@jstls/core/shortcuts/object";
import {get} from "./get";
import {SetTransformDescriptor} from "@jstls/types/core/objects/getset";

/**
 * Sets the given value as the `key` property in the target `object`, if this is defined.
 * @example
 * set(object, 'key', value) // object['key'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param value The property value.
 */
export function set<T, K extends Keys<T>>(object: T, key: K, value: T[K]): T[K];

/**
 * Sets the given value as the `key` property in the target `object`, if this is defined.
 * @example
 * set(object, 'key', value) // object['key'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param value The property value.
 */
export function set<T, K extends Keys<T>, R = any>(object: T, key: PropertyKey, value: R): R;
/**
 * Sets the given value (last argument) as the `key` (second last argument) property in the target `object`, if this is defined.
 * @example
 * set(object, 'key', 'key2', value) // object['key']['key2'] = value;
 * @param object The target object.
 * @param key The property name.
 * @param key2 The name of the property of the first get result.
 * @param keysOrValue The new value or other keys.
 */
export function set<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, key2: any, ...keysOrValue: any[]): any;
export function set<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey,): any {
  const args = arguments, lt = len(args), value = args[lt - 1];
  if (lt > 3) {
    object = apply(get, indefinite, <any>slice(args, 0, lt - 2))
    key = args[lt - 2];
  }

  if (!object)
    return indefinite;

  object[key] = value;
  return object[key];
}

export function set2<T, K extends Keys<T>>(object: T, key: K, value: T[K]): Maybe<T[K]>;
export function set2(object: KeyableObject, key: PropertyKey, value: any): any;
export function set2<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey, value: any): Maybe<K> {
  return object ? (object[key] = value, value) : indefinite;
}

/**
 * Sets the value of the `key` property in the source `object` to the `target` object.
 * @example
 * setTo(object, 'key', target) // target['key'] = object['key'];
 * @example
 * setTo(object, ['key', 'name'], target) // target['key'] = object['key']; target['name'] = object['name'];
 * @param object The source object.
 * @param key The property name.
 * @param target The target object.
 */
export function setTo<T, K extends Keys<T>>(object: T, key: K | K[], target: T): T;

/**
 * Sets the value of the `key` property in the source `object` to the `target` object.
 * @example
 * setTo(object, 'key', target) // target['key'] = object['key'];
 * @example
 * setTo(object, ['key', 'name'], target) // target['key'] = object['key']; target['name'] = object['name'];
 * @param object The source object.
 * @param key The property name.
 * @param target The target object.
 */
export function setTo<T, K extends Keys<T>>(object: T, key: PropertyKey | PropertyKey[], target: T): T;
/**
 * Sets the value of the descriptor properties in the source `object` to the `target` object.
 * @example
 * setTo(object, { name: toFloat }, target) // target['name'] = toFloat(source['name'])
 *
 * @param object The source object.
 * @param descriptor The keys descriptors
 * @param target The target object.
 */
export function setTo<T, R = KeyableObject>(object: T, descriptor: SetToDescriptor<T>, target: Partial<R>): R;
/**
 * Sets the value of the `key` property in the source `object` to the `target` object.
 * @example
 * setTo(object, 'key', target) // target['key'] = object['key'];
 * @example
 * setTo(object, ['key', 'name'], target) // target['key'] = object['key']; target['name'] = object['name'];
 * @param object The source object.
 * @param key The property name.
 * @param target The target object.
 */
export function setTo(object: KeyableObject, key: PropertyKey | PropertyKey[], target: KeyableObject): KeyableObject;
export function setTo<T, K extends Keys<T>>(object: T & KeyableObject, key: K | PropertyKey | (K | PropertyKey)[], target: T & KeyableObject): KeyableObject {
  let props: KeyableObject = {};
  if (isString(key)) {
    props[key as string] = self;
  } else if (isArray(key)) {
    props = reduce(key, (props, name) => {
      props[name] = self;
      return props;
    }, props)
  } else if (!isObject(key))
    return target;
  else props = key as any;

  return reduce(keys(props), (target, name) => {
    hasOwn(object, name) && ((target as KeyableObject)[name] = props[name](object[name]));
    return target;
  }, target);
}

/**
 * Sets the value of the descriptor properties in the source `object` to the `target` object.
 * @example Simple set
 * setTransform({name: 1}, {name: 'n'}, {}) // { n: 1 }
 * @example Set with transform
 * setTransform({name: 1}, {name: {key: 'n', value: String}}, {}) // { n: '1' }
 * @example Set with reverse
 * setTransform({n: 1}, {name: {key: 'n', value: String}}, {}, true) // { name: '1' }
 * @param source The source object.
 * @param descriptor The keys descriptors.
 * @param target The target object.
 * @param reverse Whether to exchange the property keys.
 */
export function setTransform<T>(source: T, descriptor: SetTransformDescriptor<T>, target: Partial<T>, reverse?: boolean): T;
export function setTransform<T>(source: T, descriptor: SetTransformDescriptor<T>, target: T & KeyableObject, reverse?: boolean): T {
  return reduce(keys(descriptor), (target, prop) => {
    let mapper = self,
      value = get(descriptor, prop) as any;

    if (isObject(value)) {
      mapper = value.value || self;
      value = value.key;
    }

    if (reverse) {
      const aux = value;
      value = prop;
      prop = aux;
    }

    isDefined(value) && hasOwn(source, prop) && set(target, value, mapper(get(source, prop)));
    return target
  }, target)
}
