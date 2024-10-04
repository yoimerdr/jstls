// hasOwn
import {Keys} from "../../../types/core";
import {apply} from "../../functions/apply";

export function hasOwn<T, K extends Keys<T>>(target: T, key: K): boolean;
export function hasOwn<T>(target: T, key: PropertyKey): boolean;
export function hasOwn<T, K extends Keys<T> | PropertyKey>(target: T, key: K): boolean {
  return apply(Object.prototype.hasOwnProperty, target, [key]);
}
