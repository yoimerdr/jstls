import {doc} from "@jstls/components/shared/constants";
import {bind} from "@jstls/core/functions/bind";
import {indefinite} from "@jstls/core/utils/types";
import {isDefined} from "@jstls/core/objects/types/fn";

export const create = bind(doc.createElement, doc),
  createNS = bind(doc.createElementNS, doc),
  text = bind(doc.createTextNode, doc),
  createSVG = bind(createNS, indefinite!, "http://www.w3.org/2000/svg") as {
  <K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K];
  (name: string): SVGElement;
};

export function innerHTML(el: Element): string;
export function innerHTML(el: Element, html: Object): string;
export function innerHTML(el: Element, html?: Object) {
  isDefined(html) && (el.innerHTML = html as string);
  return el.innerHTML;
}
