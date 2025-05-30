import {MaybeString} from "@jstls/types/core";
import {KeyableObject} from "@jstls/types/core/objects";
import {isDefined, isPlainObject} from "@jstls/core/objects/types";
import {reduce} from "@jstls/core/iterable";
import {keys} from "@jstls/core/shortcuts/object";
import {indefinite} from "@jstls/core/utils/types";
import {fromEntries} from "@jstls/core/polyfills/objects/es2019";
import {apply} from "@jstls/core/functions/apply";
import {startsWith} from "@jstls/core/polyfills/string/es2015";
import {len} from "@jstls/core/shortcuts/indexable";
import {set2} from "@jstls/core/objects/handlers/getset";

function _toAttribute(name: string | KeyableObject<Object>, value?: Object) {
  return isPlainObject(name) ? name as KeyableObject<Object> : fromEntries([[name as string, value!]]);
}

function _mapAttribute(el: Element, attributes: KeyableObject<Object>, add: boolean, prefix?: string): string {
  return reduce(
    keys(attributes),
    (value, key) => {
      prefix && (key = prefix + (key as string));
      value = attributes[key as any] as string;
      if (add) {
        if (isDefined(value))
          el.setAttribute(key as string, value as string);
        else value = el.getAttribute(key as string)!;
      } else {
        value = el.getAttribute(key as string)!;
        el.removeAttribute(key as string);
      }

      return value;
    },
    indefinite! as string,
  )
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
  return _mapAttribute(el, _toAttribute(name, value), true);
}

export function dataAttribute(el: Element, name: string | KeyableObject<Object>, value?: Object): string {
  return _mapAttribute(el, _toAttribute(name, value), true, "data-");
}

export function removeAttribute(el: Element, name: string | KeyableObject<Object>): string {
  return _mapAttribute(el, _toAttribute(name,), false) as string;
}

export function removeDataAttribute(el: Element, name: string | KeyableObject<Object>): string {
  return _mapAttribute(el, _toAttribute(name), false, "data-") as string;
}

export function attributes(el: Element, prefix?: string): KeyableObject<string> {
  let names = el.getAttributeNames(),
    map: KeyableObject = {};
  for (let i = 0; i < len(names); i++) {
    const name = names[i];
    (!prefix || apply(startsWith, name, [prefix])) && set2(map, name, el.getAttribute(name)!);
  }

  return map;
}
