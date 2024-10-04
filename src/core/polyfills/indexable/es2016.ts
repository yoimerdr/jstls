import {ArrayLike} from "../../../types/core/array";
import {apply} from "../../functions/apply";

export function includes<T, A extends ArrayLike<T>>(this: A, searchElement: any, fromIndex?: number): boolean {
  return this.length === 0 ? false : apply(Array.prototype.indexOf, this, [searchElement, fromIndex]) !== -1;
}
