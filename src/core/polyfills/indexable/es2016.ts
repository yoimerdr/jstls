import {ArrayLike} from "../../../types/core/array";
import {protoapply} from "../../functions/prototype/apply";
import {len} from "../../shortcuts/indexable";

export function includes<T, A extends ArrayLike<T> = ArrayLike<T>>(this: A, searchElement: any, fromIndex?: number): boolean {
  const $this = this;
  return len($this) === 0 ? false : protoapply(Array, "indexOf", $this, [searchElement, fromIndex]) !== -1;
}
