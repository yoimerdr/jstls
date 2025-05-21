import {doc} from "@jstls/components/shared/constants";
import {bind} from "@jstls/core/functions/bind";

export const create = bind(doc.createElement, doc),
  createNS = bind(doc.createElementNS, doc),
  text = bind(doc.createTextNode, doc);


export function createSGV<K extends keyof SVGElementTagNameMap>(name: K): SVGElementTagNameMap[K];
export function createSGV(name: string): SVGElement;
export function createSGV(name: string) {
  return createNS("http://www.w3.org/2000/svg", name);
}

export function firstEl(el: Element) {
  return el.firstElementChild;
}

export function lastEl(el: Element) {
  return el.lastElementChild;
}

export function innerHTML(el: Element, html: Object) {
  el.innerHTML = html as string;
}
