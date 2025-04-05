import {Keys} from "../../types/core";
import {apply} from "../../core/functions/apply";
import {slice} from "../../core/iterable";
/**
 * Appends a child on an element
 * @param target The target element
 * @param child The child to append.
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Node/appendChild)
 * */
export function append<T extends Node>(target: HTMLElement, child: T) {
  return target.appendChild(child);
}

/**
 * Sets an attribute on an element
 * @param el The target element
 * @param name The attribute name
 * @param value The attribute value
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/setAttribute)
 */
export function attribute(el: Element, name: string, value: Object) {
  el.setAttribute(name, value as string)
}

/**
 * Creates a new HTML element
 * @param tag The HTML tag name
 * @param options Optional creation options
 * @returns The created element
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Document/createElement)
 */
export function create<K extends Keys<HTMLElementTagNameMap>>(tag: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K] {
  return document.createElement(tag, options)
}

/**
 * Toggles a class on an element
 * @param el The target element
 * @param token The class name to toggle
 * @param force Optional boolean to force add/remove
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/toggle)
 */
export function toggleClass<T extends { readonly classList: DOMTokenList }>(el: T, token: string, force?: boolean) {
  el.classList.toggle(token, force)
}

/**
 * Adds one or more classes to an element
 * @param el The target element
 * @param token The class names to add
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/add)
 */
export function addClass<T extends { readonly classList: DOMTokenList }>(el: T, ...token: string[]) {
  const list = el.classList;
  apply(list.add, list, slice(arguments, 1))
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

/**
 * Adds an event listener to an element or media query
 * @param el The target element or media query
 * @param type The event type
 * @param listener The event handler function
 * @param options Optional event listener options
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
 */
export function onEvent<T extends MediaQueryList, K extends keyof MediaQueryListEventMap>(el: T, type: K, listener: (this: T, ev: MediaQueryListEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<T extends Element, K extends Keys<HTMLElementEventMap>>(el: T, type: K, listener: (this: T, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<K extends Keys<HTMLElementEventMap>>(el: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
export function onEvent(el: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  el.addEventListener(type, listener, options);
}
