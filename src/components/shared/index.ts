import {Maybe, MaybeString} from "@/types/core";
import {reduce, slice} from "@/core/iterable";
import {isDefined, isPlainObject} from "@/core/objects/types";
import {KeyableObject} from "@/types/core/objects";
import {indefinite} from "@/core/utils/types";
import {keys} from "@/core/shortcuts/object";

export {create} from "./elements";

export {addClass, toggleClass} from "./styles";
export {onEvent} from "./events";


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

export function remove<T extends Node>(target: Node, child: T, ...children: Element[]): Maybe<T> {
  return reduce(slice(arguments, 1), (_, value) => {
    return target.removeChild(value);
  }, indefinite)
}


export function attribute(el: Element, name: string): MaybeString;
/**
 * Sets an attribute on an element
 * @param el The target element
 * @param name The attribute name
 * @param value The attribute value
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttribute)
 */
export function attribute(el: Element, name: string, value: Object): string;
export function attribute(el: Element, attributes: KeyableObject<Object>): string;
export function attribute(el: Element, name: string | KeyableObject<Object>, value?: Object): string {
  if (isPlainObject(name)) {
    return reduce(
      keys(name),
      (_, value) => attribute(el, value as string, name[value as any]),
      indefinite! as string,
    )
  }

  isDefined(value) && el.setAttribute(name as string, value as string)
  return el.getAttribute(name as string)!;
}


/**
 * Finds the first element matching a selector within a parent node
 * @param el The parent node to search within
 * @param selectors The selector string
 * @returns The first matching element or null if none found
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/querySelector)
 */
export function selector<K extends keyof HTMLElementTagNameMap, T extends ParentNode>(el: T, selectors: K): HTMLElementTagNameMap[K] | null;
export function selector<K extends keyof SVGElementTagNameMap, T extends ParentNode>(el: T, selectors: K): SVGElementTagNameMap[K] | null;
export function selector<K extends keyof MathMLElementTagNameMap, T extends ParentNode>(el: T, selectors: K): MathMLElementTagNameMap[K] | null;
export function selector<E extends Element = Element, T extends ParentNode = ParentNode>(el: T, selectors: string): E | null;
export function selector<E extends Element = Element, T extends ParentNode = ParentNode>(el: T, selectors: string): E | null {
  return el.querySelector(selectors);
}

export function selectorAll<K extends keyof HTMLElementTagNameMap, T extends ParentNode>(el: T, selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
export function selectorAll<K extends keyof SVGElementTagNameMap, T extends ParentNode>(el: T, selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
export function selectorAll<K extends keyof MathMLElementTagNameMap, T extends ParentNode>(el: T, selectors: K): NodeListOf<MathMLElementTagNameMap[K]>;
/** @deprecated */
export function selectorAll<K extends keyof HTMLElementDeprecatedTagNameMap, T extends ParentNode = ParentNode>(el: T, selectors: K): NodeListOf<Element>;
export function selectorAll<T extends ParentNode = ParentNode>(el: T, selectors: string): NodeListOf<Element>;
export function selectorAll<T extends ParentNode = ParentNode>(el: T, selectors: string): NodeListOf<Element> {
  return el.querySelectorAll(selectors);
}
