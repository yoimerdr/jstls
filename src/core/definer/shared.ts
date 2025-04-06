import {Keys} from "../../types/core";
import {keys} from "../shortcuts/object";
import {forEach} from "../shortcuts/array";
import {PropertyDescriptor} from "../../types/core/objects/definer";

export function multiple<T, D>(target: T, descriptors: D, definer: (target: T, key: Keys<D>, descriptor: NonNullable<D[Keys<D>]>) => void) {
  forEach(keys(descriptors), key => definer(target, key, descriptors[key]!))
}

export function descriptor<T = any, K extends Keys<T> = any>(value?: T[K], writable?: boolean, configurable?: boolean,
                                                             enumerable?: boolean): PropertyDescriptor {
  return {
    value,
    writable,
    enumerable,
    configurable,
  }
}

export function descriptor2<T = any, K extends Keys<T> = any>(get?: (this: T) => T[K], set?: (this: T, v: T[K]) => void, configurable?: boolean,
                                                              enumerable?: boolean): PropertyDescriptor {
  return {
    get,
    set,
    configurable,
    enumerable,
  }
}
