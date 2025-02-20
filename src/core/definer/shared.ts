import {Keys} from "../../types/core";
import {keys} from "../objects/handlers/properties";
import {forEach} from "../shortcuts/array";

export function multiple<T, D>(target: T, descriptors: D, definer: (target: T, key: Keys<D>, descriptor: D[Keys<D>]) => void) {
  forEach(keys(descriptors), key => definer(target, key, descriptors[key]))
}

export function descriptor(value?: any, writable?: boolean, configurable?: boolean,
                           enumerable?: boolean): PropertyDescriptor {
  return {
    value,
    writable,
    enumerable,
    configurable,
  }
}

export function descriptor2(get?: () => any, set?: (v: any) => void, writable?: boolean, configurable?: boolean,
                            enumerable?: boolean): PropertyDescriptor {
  return {
    get,
    set,
    writable,
    configurable,
    enumerable,
  }
}
