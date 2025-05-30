import {Keys} from "@jstls/types/core";
import {PropertyDescriptor} from "@jstls/types/core/objects/definer";
import {keach} from "@jstls/core/iterable/each";

export function multiple<T, D>(target: T, descriptors: D, definer: (target: T, key: Keys<D>, descriptor: NonNullable<D[Keys<D>]>) => void) {
  keach(descriptors, (descriptor, key) => definer(target, key, descriptor!));
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
