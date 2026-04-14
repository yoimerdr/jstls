import {multiple} from "@jstls/core/definer/shared";
import {Keys} from "@jstls/types/core";
import {DefinePropertyDescriptor, DefinePropertyDescriptors} from "@jstls/types/core/objects/definer";
import {defineProperty} from "@jstls/core/shortcuts/object";
import {KeyableObject} from "@jstls/types/core/objects";
import {bind} from "@jstls/core/functions/bind";
import {indefinite} from "@jstls/core/utils/types";
import {hasOwn} from "@jstls/core/polyfills/objects/es2022";

/**
 * Define a new property if it doesn't exist.
 * @param target The target value.
 * @param key The object key.
 * @param descriptor The object key descriptor.
 * @param override Whether to override existing property if it exists. Default is false.
 *
 * @see {Object.defineProperty}
 */
export function prop<T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, descriptor: DefinePropertyDescriptor<T, K>, override?: boolean) {
  try {
    // safe define for existing non-configurable descriptor
    if (override || !hasOwn(target, key)) {
      defineProperty(target, key, descriptor)
    }
  } catch (e) {
  }
}

/**
 * Define new properties if they don't exist.
 * @param target The target value.
 * @param descriptors The object keys and their descriptors.
 *
 * @see {prop}
 */
export const props = bind(multiple, indefinite, prop) as {
  <T>(target: T, descriptors: DefinePropertyDescriptors<T>): void;
  <T>(target: T, descriptors: KeyableObject<PropertyDescriptor>): void;
}
