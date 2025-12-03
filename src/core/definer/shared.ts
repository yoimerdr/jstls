import {Keys} from "@jstls/types/core";
import {PropertyDescriptor} from "@jstls/types/core/objects/definer";
import {keach} from "@jstls/core/iterable/each";

/**
 * Apply a property definer function to multiple descriptors.
 *
 * This helper iterates over an object of descriptors and calls the provided
 * `definer` callback for each key/descriptor pair.
 *
 * @param definer - Function that defines a single property on `target`.
 *                  Receives (target, key, descriptor).
 * @param target - The object on which descriptors will be defined.
 * @param descriptors - A map-like object containing property descriptors.
 */
export function multiple<T, D>(definer: (target: T, key: Keys<D>, descriptor: NonNullable<D[Keys<D>]>) => void, target: T, descriptors: D,) {
  keach(descriptors, (descriptor, key) => definer(target, key, descriptor!));
}

/**
 * Create a simple (data) property descriptor.
 *
 * Returns an object suitable for `Object.defineProperty` representing a
 * data descriptor with an optional value and flags.
 *
 * @param value - The property value.
 * @param writable - Whether the property is writable. If omitted the property will
 *                   have an undefined `writable` attribute (truthy/falsey semantics
 *                   are determined by the runtime when used).
 * @param configurable - Whether the property is configurable.
 * @param enumerable - Whether the property shows up during enumeration.
 * @returns A PropertyDescriptor representing a data property.
 */
export function descriptor<T = any, K extends Keys<T> = any>(value?: T[K], writable?: boolean, configurable?: boolean,
                                                             enumerable?: boolean): PropertyDescriptor {
  return {
    value,
    writable,
    enumerable,
    configurable,
  }
}

/**
 * Create an accessor property descriptor.
 *
 * Returns an object suitable for `Object.defineProperty` representing an
 * accessor descriptor with optional getter/setter functions and flags.
 *
 * @param get - Optional getter function that will be called with `this` bound to `T`.
 * @param set - Optional setter function that will be called with `this` bound to `T`.
 * @param configurable - Whether the property is configurable.
 * @param enumerable - Whether the property shows up during enumeration.
 * @returns A PropertyDescriptor representing an accessor property.
 */
export function descriptor2<T = any, K extends Keys<T> = any>(get?: (this: T) => T[K], set?: (this: T, v: T[K]) => void, configurable?: boolean,
                                                              enumerable?: boolean): PropertyDescriptor {
  return {
    get,
    set,
    configurable,
    enumerable,
  }
}
