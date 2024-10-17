// hasOwn
import {Keys} from "../../../types/core";
import {protoapply} from "../../functions/prototype";

export function hasOwn<T, K extends Keys<T>>(target: T, key: K): boolean;
export function hasOwn<T>(target: T, key: PropertyKey): boolean;
export function hasOwn<T extends Object, K extends Keys<T> | PropertyKey>(target: T, key: K): boolean {
  return protoapply(Object,"hasOwnProperty", target, [key]);
}
