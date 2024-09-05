import {prop} from "./props";
import {multiple} from "./shared";
import {Keys} from "../../types/core";
import {DefinePropertyDescriptor, DefinePropertyValues} from "../../types/core/objects/definer";
import {MaybeKeyObjectType} from "../../types/core/objects";

function _value<T, K extends Keys<T> | PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>, writable: boolean) {
  prop(target, key, <DefinePropertyDescriptor<T, K>>{
    enumerable: false,
    value,
    writable
  })
}

/**
 * A shortcut for define a new property according to key and value.
 * @example
 * // the call:
 * value(key, value);
 *
 * // It is equals to call:
 * prop(key, {
 *  enumerable: false,
 *  value: value,
 *  writable: false
 * });
 *
 * @param target The target value.
 * @param key The object key.
 * @param value The object key descriptor value.
 *
 * @see {prop}
 */
export function readonly<T, K extends Keys<T> | PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>) {
  _value(target, key, value, false)
}
/**
 * A shortcut for define new properties according to keys and values.
 * @param target The target value.
 * @param values The property keys and values.
 * @see {readonly}
 */
export function readonlys<T>(target: T, values: DefinePropertyValues<T>): void;
export function readonlys<T>(target: T, values: DefinePropertyValues<T>) {
  multiple(target, values, readonly)
}


/**
 * A shortcut for define a new property according to key and value.
 * @example
 * // the call:
 * writeable(key, value);
 *
 * // It is equals to call:
 * prop(key, {
 *  enumerable: false,
 *  value: value,
 *  writable: true
 * });
 *
 * @param target The target value.
 * @param key The object key.
 * @param value The object key descriptor value.
 *
 * @see {prop}
 */
export function writeable<T, K extends Keys<T> | PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>) {
  _value(target, key, value, true)
}
/**
 * A shortcut for define new properties according to keys and values.
 * @param target The target value.
 * @param values The property keys and values.
 * @see {writeable}
 */
export function writeables<T>(target: T, values: DefinePropertyValues<T>) {
  multiple(target, values, writeable)
}


export function configurable<T, K extends Keys<T> | PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>) {
  prop(target, key, <DefinePropertyDescriptor<T, K>> {
    value,
    enumerable: false,
    configurable: true,
  })
}

export function configurables<T>(target: T, values: DefinePropertyValues<T>) {
  multiple(target, values, writeable)
}
