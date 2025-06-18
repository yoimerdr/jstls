import {prop} from "@jstls/core/definer/props";
import {descriptor, multiple} from "@jstls/core/definer/shared";
import {Keys, MaybeBoolean} from "@jstls/types/core";
import {DefinePropertyValues} from "@jstls/types/core/objects/definer";
import {MaybeKeyObjectType} from "@jstls/types/core/objects";
import {indefinite} from "@jstls/core/utils/types";
import {bind} from "@jstls/core/functions/bind";

interface DefineValueProperty {
  <T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, value: MaybeKeyObjectType<T, K>): void;
}

function _value<T, K extends Keys<T> | PropertyKey>(writable: MaybeBoolean, numerable: MaybeBoolean, configurable: MaybeBoolean, target: T, key: K, value: MaybeKeyObjectType<T, K>) {
  prop(target, key, descriptor(value, writable!, configurable!, numerable!))
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
export const readonly = bind(_value, indefinite, indefinite, indefinite, indefinite) as DefineValueProperty,

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
  readonly2 = bind(_value, indefinite, indefinite, true, indefinite) as DefineValueProperty,

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
  writeable = bind(_value, indefinite, true, indefinite, indefinite) as DefineValueProperty,

  writeable2 = bind(_value, indefinite, true, true, indefinite) as DefineValueProperty,

  configurable = bind(_value, indefinite, indefinite, indefinite, true) as DefineValueProperty,
  configurable2 = bind(_value, indefinite, indefinite, true, true) as DefineValueProperty,

  /**
   * A shortcut for define new properties according to keys and values.
   * @param target The target value.
   * @param values The property keys and values.
   * @see {readonly}
   */
  readonlys = bind(multiple, indefinite, readonly) as <T>(target: T, values: DefinePropertyValues<T>) => void,

  /**
   * A shortcut for define new properties according to keys and values.
   * @param target The target value.
   * @param values The property keys and values.
   * @see {readonly2}
   */
  readonlys2 = bind(multiple, indefinite, readonly) as <T>(target: T, values: DefinePropertyValues<T>) => void,
  /**
   * A shortcut for define new properties according to keys and values.
   * @param target The target value.
   * @param values The property keys and values.
   * @see {writeable}
   */
  writeables = bind(multiple, indefinite, writeable) as <T>(target: T, values: DefinePropertyValues<T>) => void,

  configurables = bind(multiple, indefinite, configurable) as <T>(target: T, values: DefinePropertyValues<T>) => void;
