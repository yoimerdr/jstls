// hasOwn
import {Keys} from "@jstls/types/core";
import {protoapply} from "@jstls/core/functions/prototype/apply";
import {bind} from "@jstls/core/functions/bind";
import {prototype} from "@jstls/core/shortcuts/object";

export const has = bind(prototype(Object).hasOwnProperty,);
export function hasOwn<T, K extends Keys<T>>(target: T, key: K): boolean;
export function hasOwn<T>(target: T, key: PropertyKey): boolean;
export function hasOwn<T extends Object, K extends Keys<T> | PropertyKey>(target: T, key: K): boolean {
  return protoapply(Object,"hasOwnProperty", target, [key]);
}
