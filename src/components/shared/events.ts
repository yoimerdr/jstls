import {isArray} from "@jstls/core/shortcuts/array";
import {Keys} from "@jstls/types/core";
import {len} from "@jstls/core/shortcuts/indexable";
import {apply} from "@jstls/core/functions/apply";
import {caller} from "@jstls/core/objects/handlers/builder";
import {get2} from "@jstls/core/objects/handlers/getset";
import {isDefined} from "@jstls/core/objects/types";

/**
 * Adds an event listener to an element or media query
 * @param el The target element or media query
 * @param type The event type
 * @param listener The event handler function
 * @param options Optional event listener options
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/EventTarget/addEventListener)
 */
export function onEvent<T extends MediaQueryList, K extends keyof MediaQueryListEventMap>(el: T, type: K | K[], listener: (this: T, ev: MediaQueryListEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<T extends Document, K extends keyof DocumentEventMap>(el: T, type: K | K[], listener: (this: T, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<T extends Window, K extends keyof WindowEventMap>(el: T, type: K | K[], listener: (this: T, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<T extends Element, K extends Keys<HTMLElementEventMap>>(el: T, type: K | K [], listener: (this: T, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function onEvent<K extends Keys<HTMLElementEventMap>>(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
export function onEvent(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  type = isArray(type) ? type : [type];
  for (let i = 0; i < len(type); i++)
    el.addEventListener(type[i], listener, options);
}

export function onClick<T extends EventTarget>(el: T, listener: (this: T, event: MouseEvent) => void, options?: boolean | AddEventListenerOptions) {
  onEvent(el, "click", <any>listener, options);
}

export function onClickOutside<T extends Element>(el: T, listener: (this: T, event: MouseEvent) => void, options?: boolean | AddEventListenerOptions) {
  function handleClick(event: MouseEvent) {
    const target = event.target as T;
    !el.contains(target) && apply(listener, target, [event]);
  }

  const doc = document;
  onClick(doc, handleClick, options);

  return () => offEvent(doc, "click", handleClick);
}

export const stopPropagation = caller<Event>("stopPropagation") as EventListener,
  preventDefault = caller<Event>("preventDefault") as EventListener;

export function offEvent<T extends MediaQueryList, K extends keyof MediaQueryListEventMap>(el: T, type: K | K[], listener: (this: T, ev: MediaQueryListEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function offEvent<T extends Document, K extends keyof DocumentEventMap>(el: T, type: K | K[], listener: (this: T, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function offEvent<T extends Window, K extends keyof WindowEventMap>(el: T, type: K | K[], listener: (this: T, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function offEvent<T extends Element, K extends Keys<HTMLElementEventMap>>(el: T, type: K | K [], listener: (this: T, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
export function offEvent<K extends Keys<HTMLElementEventMap>>(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
export function offEvent(el: EventTarget, type: string | string[], listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) {
  type = isArray(type) ? type : [type];
  for (let i = 0; i < len(type); i++)
    el.removeEventListener(type[i], listener, options);
}

export function getEventPosition(ev: MouseEvent | TouchEvent): [number, number] {
  let pageX = get2(ev, "pageX"),
    pageY = get2(ev, "pageY");

  if (!isDefined(pageX) || !isDefined(pageY)) {
    const touch = get2(get2(ev, "touches"), 0);

    pageX = get2(touch, "clientX");
    pageY = get2(touch, "clientY");
  }

  return [pageX, pageY];
}
