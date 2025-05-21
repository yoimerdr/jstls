import {reduce, slice} from "@jstls/core/iterable";
import {indefinite} from "@jstls/core/utils/types";
import {len} from "@jstls/core/shortcuts/indexable";
import {Maybe} from "@jstls/types/core";

/**
 * Appends a child on an element
 * @param target The target element
 * @param child The child to append.
 * @param children The childreen to append;
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/appendChild)
 * */
export function append<T extends Node>(target: Node, child: T, ...children: Element[]): Maybe<T> {
  return reduce(slice(arguments, 1), (_, value) => {
    return target.appendChild(value);
  }, indefinite);
}

export function remove<T extends Node>(target: Node, child: Node, ...children: Node[]): Maybe<T>;
export function remove<T extends Node>(target: Node): Maybe<T>;
export function remove<T extends Node>(target: Node, ...children: Node[]): Maybe<T> {
  const args = arguments;
  if (len(args) === 1)
    return remove(target.parentNode!, target)
  return reduce(slice(args, 1), (_, value) => {
    return target.removeChild(value);
  }, indefinite)
}
