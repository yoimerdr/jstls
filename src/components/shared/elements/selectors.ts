import {doc} from "@jstls/components/shared/constants";
import {slice} from "@jstls/core/iterable";

/**
 * Finds the first element matching a selector within a parent node
 * @param selectors The selector string
 * @param context The parent node to search within
 * @returns The first matching element or null if none found
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/querySelector)
 */
export function selector<K extends keyof HTMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): HTMLElementTagNameMap[K] | null;
export function selector<K extends keyof SVGElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): SVGElementTagNameMap[K] | null;
export function selector<K extends keyof MathMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): MathMLElementTagNameMap[K] | null;
export function selector<E extends Element = Element, T extends ParentNode = ParentNode>(selectors: string, context?: T): E | null;
export function selector<E extends Element = Element, T extends ParentNode = ParentNode>(selectors: string, context?: T): E | null {
  return (context || doc).querySelector(selectors);
}

export function selectorAll<K extends keyof HTMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): NodeListOf<HTMLElementTagNameMap[K]>;
export function selectorAll<K extends keyof SVGElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): NodeListOf<SVGElementTagNameMap[K]>;
export function selectorAll<K extends keyof MathMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): NodeListOf<MathMLElementTagNameMap[K]>;
/** @deprecated */
export function selectorAll<K extends keyof HTMLElementDeprecatedTagNameMap, T extends ParentNode = ParentNode>(selectors: K, context?: T): NodeListOf<Element>;
export function selectorAll<T extends ParentNode = ParentNode>(selectors: string, context?: T): NodeListOf<Element>;
export function selectorAll<T extends ParentNode = ParentNode>(selectors: string, context?: T): NodeListOf<Element> {
  return (context || doc).querySelectorAll(selectors);
}

export function byId<T extends Element>(elementId: string, context?: NonElementParentNode): T | null {
  return (context! || doc).getElementById(elementId) as T;
}

export function siblings<T extends ParentNode>(context: T): Array<Element>;
export function siblings<T extends ParentNode, K extends keyof HTMLElementTagNameMap>(context: T, selector: K): Array<HTMLElementTagNameMap[K]>;
export function siblings<T extends ParentNode, K extends keyof SVGElementTagNameMap>(context: T, selector: K): Array<SVGElementTagNameMap[K]>;
export function siblings<T extends ParentNode>(context: T, selector: string): Array<Element>;
export function siblings<T extends ParentNode>(context: T, selector?: string): Array<Element> {
  if (!context || !context.parentNode)
    return [];

  return slice(context.parentNode.children)
    .filter(el => (el !== context as any) && (!selector || el.matches(selector)))
}
