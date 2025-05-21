import {MaybeString} from "@/types/core";
import {KeyableObject} from "@/types/core/objects";
import {isDefined, isPlainObject} from "@/core/objects/types";
import {reduce} from "@/core/iterable";
import {keys} from "@/core/shortcuts/object";
import {indefinite} from "@/core/utils/types";

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

export function removeAttribute(el: Element, name: string | KeyableObject<Object>): string {
  if (isPlainObject(name)) {
    return reduce(
      keys(name),
      (_, value) => removeAttribute(el, value as string),
      indefinite! as string,
    );
  }
  const attr = el.getAttribute(name as string)
  el.removeAttribute(name as string)
  return attr!;
}
