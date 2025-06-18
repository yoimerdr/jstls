import {Keys} from "@jstls/types/core";
import {get2, set2} from "@jstls/core/objects/handlers/getset";
import {KeyableObject} from "@jstls/types/core/objects";
import {keach} from "@jstls/core/iterable/each";

export function setPropertyStyle<K extends Keys<CSSStyleDeclaration>>(el: ElementCSSInlineStyle, name: K | string, value: CSSStyleDeclaration[K] | string) {
  set2(el.style, name, value);
}

export function getPropertyStyle<K extends Keys<CSSStyleDeclaration>>(el: ElementCSSInlineStyle, name: K | string): CSSStyleDeclaration[K] | string {
  return get2(el.style, name);
}

export function setStyle(el: ElementCSSInlineStyle, style: KeyableObject<string> | Partial<CSSStyleDeclaration>) {
  keach(style, (value, key) => {
    setPropertyStyle(el, key, value as string);
  });
}
