import {Keys, MethodKeys, PropertiesKeys} from "../../../types/core";
import {call} from "../../functions/call";
import {isFunction} from "../types";
import {includes} from "../../polyfills/indexable/es2016";
import {filter} from "../../iterable/filter";
import {nreturns} from "../../utils/fn";
import {nullable} from "../../utils/types";
import {PropertyDescriptors} from "../../../types/core/objects/definer";
import {reduce} from "../../iterable";
import {descriptor, keys, propertyNames} from "../../shortcuts/object";

export function descriptors<T>(object: T, mode?: 'keys' | 'names'): PropertyDescriptors<T> {
  return reduce((mode === 'names' ? propertyNames : keys)(object), (current, key) => {
    current[key] = descriptor(object, key)!;
    return current;
  }, <PropertyDescriptors<T>>{})
}


export const commonStatics = ['length', 'name', 'prototype',],
  commonPrototype = ["constructor"];

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

/*
 * @deprecated exports
 */
export {keys, propertyNames}
