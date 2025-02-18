import {len} from "../../shortcuts/indexable";

export function at<T>(this: ArrayLike<T>, index: number): T {
  index = index >> 0;
  if (index < 0)
    index = len(this) + index;
  return this[index]
}
