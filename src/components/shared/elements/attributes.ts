import {MaybeString} from "@jstls/types/core";
import {KeyableObject} from "@jstls/types/core/objects";
import {isDefined, isPlainObject} from "@jstls/core/objects/types";
import {reduce} from "@jstls/core/iterable";
import {keys} from "@jstls/core/shortcuts/object";
import {indefinite} from "@jstls/core/utils/types";
import {concat} from "@jstls/core/shortcuts/indexable";

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

export function dataAttribute(el: Element, name: string, value?: Object): string {
  if (isPlainObject(name))
    return reduce(
      keys(name),
      (_, value) => attribute(el, concat("data-", name), name[value as any]),
      indefinite! as string,
    )
  return attribute(el, concat("data-", name), value!)!
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
