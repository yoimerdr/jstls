import {multiple} from "./shared";
import {Keys} from "../../types/core";
import {DefinePropertyDescriptor, DefinePropertyDescriptors} from "../../types/core/objects/definer";
import {hasOwn} from "../polyfills/objects/es2022";
import {defineProperty} from "../shortcuts/object";
import {KeyableObject} from "../../types/core/objects";

/**
 * Define a new property if it doesn't exist.
 * @param target The target value.
 * @param key The object key.
 * @param descriptor The object key descriptor.
 *
 * @see {Object.defineProperty}
 */
export function prop<T, K extends Keys<T> | PropertyKey = PropertyKey>(target: T, key: K, descriptor: DefinePropertyDescriptor<T, K>) {
  hasOwn(target, key) || defineProperty(target, key, descriptor);
}

/**
 * Define new properties if they don't exist.
 * @param target The target value.
 * @param descriptors The object keys and their descriptors.
 *
 * @see {prop}
 */
export function props<T>(target: T, descriptors: DefinePropertyDescriptors<T>): void;
export function props<T>(target: T, descriptors: KeyableObject<PropertyDescriptor>): void;
export function props<T>(target: T, descriptors: DefinePropertyDescriptors<T>) {
  multiple(target, descriptors, prop)
}
