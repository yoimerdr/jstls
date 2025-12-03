import {FunctionType, Keys, Maybe} from "@jstls/types/core";
import {isDefined} from "@jstls/core/objects/types/fn";

/**
 * Returns the `this` context.
 *
 * @example
 * const obj = { a: 1 };
 * const result = self.call(obj);
 * console.log(result); // { a: 1 }
 */
export function self<T>(this: T): T {
  return this;
}

/**
 * Returns the value of a property from the `this` context.
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * const value = simple.call(obj, 'a');
 * console.log(value); // 1
 *
 * @param key The key of the property to retrieve.
 */
export function simple<T, K extends Keys<T> = Keys<T>>(this: T, key: K): T[K];
/**
 * Returns the value of a property from the `this` context.
 *
 * @example
 * const obj = { a: 1, b: 2 };
 * const value = simple.call(obj, 'other');
 * console.log(value); // undefined
 *
 * @param key The key of the property to retrieve.
 */
export function simple<T = any, R = any>(this: T, key: PropertyKey): R;
export function simple(this: any, key: any): any {
  return this[key];
}

/**
 * Retrieves a value from the `this` context and applies a mapper function to it.
 *
 * @example
 * const obj = { a: 1 };
 * const val = mapped.call(obj, 'a', (x) => x * 2);
 * console.log(val); // 2
 *
 * @param key The key of the property to retrieve.
 * @param mapper The function to apply to the value.
 */
export function mapped<T, R = any>(this: T, key: PropertyKey, mapper: (value: any) => R): R;
/**
 * Retrieves a value from the `this` context and applies a mapper function to it.
 *
 * @example
 * const obj = { a: 1 };
 * const val = mapped.call(obj, 'a', (x) => x * 2);
 * console.log(val); // 2
 *
 * @param key The key of the property to retrieve.
 * @param mapper The function to apply to the value.
 */
export function mapped<T, K extends Keys<T> = Keys<T>, R = T[K]>(this: T, key: K, mapper: (value: T[K]) => R): R;
export function mapped(this: any, key: Maybe<PropertyKey>, mapper: Maybe<FunctionType<void>>) {
  const value = isDefined(key) ? this[key!] : this;
  return mapper ? mapper(value) : value;
}
