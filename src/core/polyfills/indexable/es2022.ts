export function at<T>(this: ArrayLike<T>, index: number): T {
  index = index >> 0;
  if (index < 0)
    index = this.length + index;
  return this[index]
}
