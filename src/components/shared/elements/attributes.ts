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
import {bind} from "@jstls/core/functions/bind";

function _toAttribute(name: string | KeyableObject<Object>, value?: Object) {
  return isPlainObject(name) ? name as KeyableObject<Object> : fromEntries([[name as string, value!]]);
}

function _mapAttribute(add: boolean, prefix: MaybeString, el: Element, attributes: string | KeyableObject<Object>, value?: Object): string {
  attributes = _toAttribute(attributes, value);

  return reduce(
    keys(attributes),
    (value, key) => {
      value = attributes[key as any] as string;
      prefix && (key = prefix + (key as string));
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

export interface SetAttribute {
  (el: Element, name: string): MaybeString;

  (el: Element, name: string, value: Object): string;

  (el: Element, attributes: KeyableObject<Object>): string;
}

export interface RemoveAttribute {
  (el: Element, name: string | KeyableObject<Object>): string
}

export const attribute = bind<any>(_mapAttribute, indefinite, true, indefinite) as SetAttribute;

export const dataAttribute = bind<any>(_mapAttribute, indefinite, true, "data-") as SetAttribute;

export const removeAttribute = bind<any>(_mapAttribute, indefinite, false, indefinite) as RemoveAttribute;

export const removeDataAttribute = bind<any>(_mapAttribute, indefinite, false, indefinite, "data-") as RemoveAttribute;

export function attributes(el: Element, prefix?: string): KeyableObject<string> {
  let names = el.getAttributeNames(),
    map: KeyableObject = {};
  for (let i = 0; i < len(names); i++) {
    const name = names[i];
    (!prefix || apply(startsWith, name, [prefix])) && set2(map, name, el.getAttribute(name)!);
  }

  return map;
}
