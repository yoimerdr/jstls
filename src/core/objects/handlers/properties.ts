import {Keys, MethodKeys, PropertiesKeys} from "@jstls/types/core";
import {isFunction} from "@jstls/core/objects/types";
import {includes} from "@jstls/core/polyfills/indexable/es2016";
import {filter} from "@jstls/core/iterable/filter";
import {nreturns} from "@jstls/core/utils/fn";
import {indefinite, nullable} from "@jstls/core/utils/types";
import {PropertyDescriptors} from "@jstls/types/core/objects/definer";
import {reduce} from "@jstls/core/iterable";
import {descriptor, keys, propertyNames} from "@jstls/core/shortcuts/object";
import {KeyableObject} from "@jstls/types/core/objects";
import {bind} from "@jstls/core/functions/bind";
import {apply} from "@jstls/core/functions/apply";

export interface ObjectProperties {
  <T>(object: T): PropertiesKeys<T>[];

  <T>(object: T, filter: 'statics' | 'prototype'): PropertiesKeys<T>[];
}

export interface ObjectMethods {
  <T>(object: T): MethodKeys<T>[];

  <T>(object: T, filter: 'statics' | 'prototype'): MethodKeys<T>[];
}

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
    return (!common || !apply(includes, common, [key])) && condition(desc[key].value);
  });
}

const ks = 'keys',
  ns = 'names',
  simpleKeys = bind(filterFromObject, indefinite, ks, nreturns(isFunction)) as ObjectProperties,
  methodKeys = bind(filterFromObject, indefinite, ks, isFunction) as ObjectMethods,
  simpleProperties = bind(filterFromObject, indefinite, ns, nreturns(isFunction),) as ObjectMethods,
  methodProperties = bind(filterFromObject, indefinite, ns, isFunction) as ObjectMethods;


export function hasKey<T, K extends Keys<T>>(object: T, key: K): boolean;
export function hasKey(object: KeyableObject, key: PropertyKey): boolean;
export function hasKey(object: KeyableObject, key: PropertyKey) {
  return key in object;
}

/*
 * @deprecated exports
 */
export {keys, propertyNames}

export {
  simpleKeys,
  methodProperties,
  methodKeys,
  simpleProperties,
}
