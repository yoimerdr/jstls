import {reduce, slice} from "@jstls/core/iterable";
import {indefinite} from "@jstls/core/utils/types";
import {len} from "@jstls/core/shortcuts/indexable";
import {Maybe} from "@jstls/types/core";
import {applyFirstDefined} from "@jstls/core/objects/handlers";
import {bind} from "@jstls/core/functions/bind";

/**
 * Appends a child on an element
 * @param target The target element
 * @param targets Other elements to append
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/appendChild)
 * */
export function append<T extends Node>(target: Node, ...targets: Element[]): Maybe<T>;
export function append<T extends Node>(target: Node): Maybe<T> {
  return reduce(slice(arguments, 1), (_, value) => {
    return target.appendChild(value);
  }, indefinite);
}

export function prepend<T extends Node>(target: Node, ...targets: Element[]): Maybe<T>;
export function prepend<T extends Node>(target: Node, ): Maybe<T> {
  return reduce(slice(arguments, 1), (_, value) => {
    return target.insertBefore(value, target.firstChild);
  }, indefinite);
}

export function remove<T extends Node>(target: Node, ...targets: Node[]): Maybe<T>;
export function remove<T extends Node>(target: Node): Maybe<T>;
export function remove<T extends Node>(target: Node,): Maybe<T> {
  const args = arguments;
  if (len(args) === 1)
    return remove(target.parentNode!, target)
  return reduce(slice(args, 1), (_, value) => {
    return applyFirstDefined(target, ["removeChild"], [value]);
  }, indefinite)
}

function removeEl(first: boolean, el: Node): Maybe<Node> {
  const target = first ? el.firstChild : el.lastChild;
  applyFirstDefined(el, ["removeChild"], [target]);
  return target;
}


export const removeFirst = bind(removeEl, indefinite, true) as <T extends Node>(target: Node) => Maybe<T>,
  removeLast = bind(removeEl, indefinite, false) as <T extends Node>(target: Node) => Maybe<T>;
