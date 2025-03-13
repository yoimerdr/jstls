import {Keys, MethodKeys, PropertiesKeys} from "../../../types/core";
import {call} from "../../functions/call";
import {isFunction} from "../types";
import {includes} from "../../polyfills/indexable/es2016";
import {filter} from "../../iterable/filter";
import {nreturns} from "../../utils";

interface KeysShortcut {
  <T>(object: T): Keys<T>[];
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


export const commonStatics = ['length', 'name', 'prototype',];

export const commonPrototype = ["constructor"];

function filterFromObject<T>(keys: (object: T) => Keys<T>[], condition: (value: any) => boolean, object: T, mode: 'statics' | 'prototype'): Keys<T>[] {
  const common = mode === 'statics' ? commonStatics :
    (mode === 'prototype' ? commonPrototype : null)
  return filter(keys(object), key => {
    return (!common || !call(includes, common, key)) && condition(object[key])
  });
}

export function simpleKeys<T>(object: T): PropertiesKeys<T>[];
export function simpleKeys<T>(object: T, filter: 'statics' | 'prototype'): PropertiesKeys<T>[];
export function simpleKeys<T>(object: T, mode?: 'statics' | 'prototype'): PropertiesKeys<T>[] {
  return filterFromObject(keys, nreturns(isFunction), object, mode!) as PropertiesKeys<T>[];
}

export function methodKeys<T>(object: T): MethodKeys<T>[];
export function methodKeys<T>(object: T, filter: 'statics' | 'prototype'): MethodKeys<T>[];
export function methodKeys<T>(object: T, mode?: 'statics' | 'prototype'): MethodKeys<T>[] {
  return filterFromObject(keys, isFunction, object, mode!) as MethodKeys<T>[];
}

export function simpleProperties<T>(object: T): MethodKeys<T>[];
export function simpleProperties<T>(object: T, filter: 'statics' | 'prototype'): MethodKeys<T>[];
export function simpleProperties<T>(object: T, mode?: 'statics' | 'prototype'): MethodKeys<T>[] {
  return filterFromObject(propertyNames, nreturns(isFunction), object, mode!) as MethodKeys<T>[];
}

export function methodProperties<T>(object: T): MethodKeys<T>[];
export function methodProperties<T>(object: T, filter: 'statics' | 'prototype'): MethodKeys<T>[];
export function methodProperties<T>(object: T, mode?: 'statics' | 'prototype'): MethodKeys<T>[] {
  return filterFromObject(propertyNames, isFunction, object, mode!) as MethodKeys<T>[];
}
