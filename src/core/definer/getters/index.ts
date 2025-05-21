import {prop} from "@/core/definer/props";
import {descriptor2, multiple} from "@/core/definer/shared";
import {MethodKeys} from "@/types/core";
import {DefinePropertyGetter, DefinePropertyGetters} from "@/types/core/objects/definer";

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
export function index<T>(target: T, getters: DefinePropertyGetters<T>) {
  multiple(target, getters, getter)
}
