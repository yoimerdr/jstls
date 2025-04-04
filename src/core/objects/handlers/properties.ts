import {Keys, MethodKeys, PropertiesKeys} from "../../../types/core";
import {call} from "../../functions/call";
import {isFunction} from "../types";
import {includes} from "../../polyfills/indexable/es2016";
import {filter} from "../../iterable/filter";
import {nreturns} from "../../utils";
import {nullable} from "../../utils/types";
import {PropertyDescriptor, PropertyDescriptors} from "../../../types/core/objects/definer";
import {reduce} from "../../iterable";

interface KeysShortcut {
  <T>(object: T): Keys<T>[];
}

interface DescriptorShortcut {
  <T, K extends Keys<T>>(object: T, key: K): PropertyDescriptor<T, K>;

  <T>(object: T, key: PropertyKey): PropertyDescriptor<T> | undefined;

  (object: any, key: PropertyKey): PropertyDescriptor | undefined;
}

/**
 * Returns the names of the enumerable properties and methods of an object.
 *
 * This is a short for {@link Object.keys}.
 * @param object The target object.
 * @see {Object.keys}
 */
export const keys: KeysShortcut = Object.keys;

/**
 * Returns the names of the all (including non-enumerable) properties and methods of an object.
 *
 * This is a short for {@link Object.getOwnPropertyNames}.
 *
 * @param object The target object.
 * @see {Object.getOwnPropertyNames}
 */
export const propertyNames: KeysShortcut = Object.getOwnPropertyNames;

export const descriptor = Object.getOwnPropertyDescriptor;

export function descriptors<T>(object: T, mode?: 'keys' | 'names'): PropertyDescriptors<T> {
  return reduce((mode === 'names' ? propertyNames : keys)(object), (current, key) => {
    current[key] = descriptor(object, key)!;
    return current;
  }, <PropertyDescriptors<T>>{})
}


export const commonStatics = ['length', 'name', 'prototype',];

export const commonPrototype = ["constructor"];

function filterFromObject<T>(type: 'keys' | 'names', condition: (value: any) => boolean, object: T, mode: 'statics' | 'prototype'): Keys<T>[] {
  const common = mode === 'statics' ? commonStatics :
    (mode === 'prototype' ? commonPrototype : nullable);
  const desc = descriptors(object, type);
  return filter(keys(desc), key => {
    return !common || !call(includes, common, key) && condition(desc[key].value);
  });
}

export function simpleKeys<T>(object: T): PropertiesKeys<T>[];
export function simpleKeys<T>(object: T, filter: 'statics' | 'prototype'): PropertiesKeys<T>[];
export function simpleKeys<T>(object: T, mode?: 'statics' | 'prototype'): PropertiesKeys<T>[] {
  return filterFromObject('keys', nreturns(isFunction), object, mode!) as PropertiesKeys<T>[];
}

export function methodKeys<T>(object: T): MethodKeys<T>[];
export function methodKeys<T>(object: T, filter: 'statics' | 'prototype'): MethodKeys<T>[];
export function methodKeys<T>(object: T, mode?: 'statics' | 'prototype'): MethodKeys<T>[] {
  return filterFromObject('keys', isFunction, object, mode!) as MethodKeys<T>[];
}

export function simpleProperties<T>(object: T): MethodKeys<T>[];
export function simpleProperties<T>(object: T, filter: 'statics' | 'prototype'): MethodKeys<T>[];
export function simpleProperties<T>(object: T, mode?: 'statics' | 'prototype'): MethodKeys<T>[] {
  return filterFromObject('names', nreturns(isFunction), object, mode!) as MethodKeys<T>[];
}

export function methodProperties<T>(object: T): MethodKeys<T>[];
export function methodProperties<T>(object: T, filter: 'statics' | 'prototype'): MethodKeys<T>[];
export function methodProperties<T>(object: T, mode?: 'statics' | 'prototype'): MethodKeys<T>[] {
  return filterFromObject('names', isFunction, object, mode!) as MethodKeys<T>[];
}
