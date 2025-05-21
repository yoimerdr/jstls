import {isArray} from "@/core/shortcuts/array";
import {Keys} from "@/types/core";
import {len} from "@/core/shortcuts/indexable";

/**
 * Adds an event listener to an element or media query
 * @param el The target element or media query
 * @param type The event type
 * @param listener The event handler function
 * @param options Optional event listener options
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
 */
export function onEvent<T extends MediaQueryList, K extends keyof MediaQueryListEventMap>(el: T, type: K | K[], listener: (this: T, ev: MediaQueryListEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<T extends Element, K extends Keys<HTMLElementEventMap>>(el: T, type: K | K [], listener: (this: T, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<K extends Keys<HTMLElementEventMap>>(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
export function onEvent(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  type = isArray(type) ? type : [type];
  for (let i = 0; i < len(type); i++)
    el.addEventListener(type[i], listener, options);
}

export function offEvent<T extends MediaQueryList, K extends keyof MediaQueryListEventMap>(el: T, type: K | K[], listener: (this: T, ev: MediaQueryListEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function offEvent<T extends Element, K extends Keys<HTMLElementEventMap>>(el: T, type: K | K [], listener: (this: T, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function offEvent<K extends Keys<HTMLElementEventMap>>(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
export function offEvent(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  type = isArray(type) ? type : [type];
  for (let i = 0; i < len(type); i++)
    el.removeEventListener(type[i], listener, options);
}
