import {prop} from "./props";
import {multiple} from "./shared";
import {MethodKeys} from "../../types/core";
import {DefinePropertyDescriptor, DefinePropertyGetter, DefinePropertyGetters} from "../../types/core/objects/definer";

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
export function getter<T, K extends MethodKeys<T> | PropertyKey>(target: T, key: K, getter: DefinePropertyGetter<T, K>) {
  prop(target, key, <DefinePropertyDescriptor<T, K>>{
    enumerable: false,
    get: getter
  })
}

/**
 * A shortcut for define new properties according to keys and getters.
 * @param target The target value.
 * @param getters The property keys and getter fns.
 * @see {getter}
 */
export function getters<T>(target: T, getters: DefinePropertyGetters<T>) {
  multiple(target, getters, getter)
}
