import {prop} from "@jstls/core/definer/props";
import {descriptor2, multiple} from "@jstls/core/definer/shared";
import {MethodKeys} from "@jstls/types/core";
import {DefinePropertyGetter, DefinePropertyGetters} from "@jstls/types/core/objects/definer";
import {bind} from "@jstls/core/functions/bind";
import {indefinite} from "@jstls/core/utils/types";

/**
 * A shortcut for define a new property according to key and getter fn.
 * @example
 * // the call:
 * getter(key, getter);
 *
 * // It is equals to call:
 * prop(key, {
 *  enumerable: false,
 *  get: getter
 * });
 *
 * @param target The target value.
 * @param key The object key.
 * @param getter The getter fn.
 *
 * @see {prop}
 */
export function getter<T, K extends MethodKeys<T> | PropertyKey = PropertyKey>(target: T, key: K, getter: DefinePropertyGetter<T, K>) {
  prop(target, key, descriptor2(getter,))
}

/**
 * A shortcut for define new properties according to keys and getters.
 * @param target The target value.
 * @param getters The property keys and getter fns.
 * @see {getter}
 */
export const getters = bind(multiple, indefinite, getter) as <T>(target: T, getters: DefinePropertyGetters<T>) => void;
