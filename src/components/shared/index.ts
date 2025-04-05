import {Keys} from "../../types/core";
import {apply} from "../../core/functions/apply";
import {slice} from "../../core/iterable";

export function append<T extends Node>(target: HTMLElement, child: T) {
  return target.appendChild(child);
}

export function attribute(el: Element, name: string, value: Object) {
  el.setAttribute(name, value as string)
}

export function create<K extends Keys<HTMLElementTagNameMap>>(tag: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K] {
  return document.createElement(tag, options)
}

export function toggleClass<T extends { readonly classList: DOMTokenList }>(el: T, token: string, force?: boolean) {
  el.classList.toggle(token, force)
}

export function addClass<T extends { readonly classList: DOMTokenList }>(el: T, ...token: string[]) {
  const list = el.classList;
  apply(list.add, list, slice(arguments, 1))
}

export function selector<K extends keyof HTMLElementTagNameMap, T extends ParentNode>(el: T, selectors: K): HTMLElementTagNameMap[K] | null;
export function selector<K extends keyof SVGElementTagNameMap, T extends ParentNode>(el: T, selectors: K): SVGElementTagNameMap[K] | null;
export function selector<K extends keyof MathMLElementTagNameMap, T extends ParentNode>(el: T, selectors: K): MathMLElementTagNameMap[K] | null;
export function selector<E extends Element = Element, T extends ParentNode = ParentNode>(el: T, selectors: string): E | null;
export function selector<E extends Element = Element, T extends ParentNode = ParentNode>(el: T, selectors: string): E | null {
  return el.querySelector(selectors);
}

export function onEvent<T extends MediaQueryList, K extends keyof MediaQueryListEventMap>(el: T, type: K, listener: (this: T, ev: MediaQueryListEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<T extends Element, K extends Keys<HTMLElementEventMap>>(el: T, type: K, listener: (this: T, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<K extends Keys<HTMLElementEventMap>>(el: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
export function onEvent(el: EventTarget, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  el.addEventListener(type, listener, options);
}
