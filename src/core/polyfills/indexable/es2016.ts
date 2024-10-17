import {ArrayLike} from "../../../types/core/array";
import {protoapply} from "../../functions/prototype";

export function includes<T, A extends ArrayLike<T> = ArrayLike<T>>(this: A, searchElement: any, fromIndex?: number): boolean {
  return this.length === 0 ? false : protoapply(Array, "indexOf", this, [searchElement, fromIndex]) !== -1;
}
