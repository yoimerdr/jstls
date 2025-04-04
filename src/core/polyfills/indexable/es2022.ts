import {len} from "../../shortcuts/indexable";

export function at<T>(this: ArrayLike<T>, index: number): T {
  index = index >> 0;
  const $this = this;
  index < 0 && (index = len($this) + index);
  return $this[index]
}
