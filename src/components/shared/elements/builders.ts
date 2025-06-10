import {doc} from "@jstls/components/shared/constants";
import {bind} from "@jstls/core/functions/bind";
import {indefinite} from "@jstls/core/utils/types";
import {isDefined} from "@jstls/core/objects/types";

export const create = bind(doc.createElement, doc),
  createNS = bind(doc.createElementNS, doc),
  text = bind(doc.createTextNode, doc);


export const createSVG = bind<any>(createNS, indefinite!, "http://www.w3.org/2000/svg") as {
  <K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K];
  (name: string): SVGElement;
};

export function firstEl(el: Element) {
  return el.firstElementChild;
}

export function lastEl(el: Element) {
  return el.lastElementChild;
}

export function innerHTML(el: Element, html: Object) {
  isDefined(html) && (el.innerHTML = html as string);
  return el.innerHTML;
}
