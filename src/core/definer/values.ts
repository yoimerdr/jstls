import {prop} from "@jstls/core/definer/props";
import {descriptor, multiple} from "@jstls/core/definer/shared";
import {Keys} from "@jstls/types/core";
import {DefinePropertyValues} from "@jstls/types/core/objects/definer";
import {MaybeKeyObjectType} from "@jstls/types/core/objects";
import {indefinite} from "@jstls/core/utils/types";

function _value<T, K extends Keys<T> | PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>, writable?: boolean, numerable?: boolean) {
  prop(target, key, descriptor(value, writable, indefinite, numerable))
}

/**
 * A shortcut for define a new property according to key and value.
 * @example
 * // the call:
 * readonly(key, value);
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
export function readonly<T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>) {
  _value(target, key, value,)
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
 * readonly2(key, value);
 *
 * // It is equals to call:
 * prop(key, {
 *  enumerable: true,
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
export function readonly2<T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>) {
  _value(target, key, value, indefinite, true);
}

/**
 * A shortcut for define new properties according to keys and values.
 * @param target The target value.
 * @param values The property keys and values.
 * @see {readonly2}
 */
export function readonlys2<T>(target: T, values: DefinePropertyValues<T>) {
  multiple(target, values, readonly2)
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
export function writeable<T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>) {
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


export function configurable<T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>) {
  prop(target, key, descriptor(value, indefinite, true))
}

export function configurables<T>(target: T, values: DefinePropertyValues<T>) {
  multiple(target, values, configurable)
}
