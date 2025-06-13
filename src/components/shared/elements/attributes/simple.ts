import {string} from "@jstls/core/objects/handlers";
import {MaybeString} from "@jstls/types/core";

export function setAttribute(el: Element, name: string, value: Object): string {
  value = string(value);
  el.setAttribute(name, value as string)
  return value as string;
}

export function getAttribute(el: Element, name: string): MaybeString {
  return el.getAttribute(name);
}

export function deleteAttribute(el: Element, name: string): void {
  el.removeAttribute(name);
}
