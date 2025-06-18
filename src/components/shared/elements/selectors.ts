import {doc} from "@jstls/components/shared/constants";
import {slice} from "@jstls/core/iterable";
import {concat} from "@jstls/core/shortcuts/indexable";
import {get2} from "@jstls/core/objects/handlers/getset";
import {bind} from "@jstls/core/functions/bind";
import {indefinite} from "@jstls/core/utils/types";
import {children, parent} from "@jstls/components/shared/elements/shortcuts";
import {apply} from "@jstls/core/functions/apply";

function selection(name: 'querySelector' | 'querySelectorAll' | 'getElementById', selectors: string, context?: ParentNode) {
  context = context || doc;
  return apply(get2(context, name), context, [selectors]);
}

/**
 * Finds the first element matching a selector within a parent node
 * @param selectors The selector string
 * @param context The parent node to search within
 * @returns The first matching element or null if none found
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/Element/querySelector)
 */
export const selector = bind(selection, indefinite, 'querySelector') as {
    <K extends keyof HTMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): HTMLElementTagNameMap[K] | null;
    <K extends keyof SVGElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): SVGElementTagNameMap[K] | null;
    <K extends keyof MathMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): MathMLElementTagNameMap[K] | null;
    <E extends Element = Element, T extends ParentNode = ParentNode>(selectors: string, context?: T): E | null;
  },
  selectorAll = bind(selection, indefinite, 'querySelectorAll') as {
    <K extends keyof HTMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): NodeListOf<HTMLElementTagNameMap[K]>;
    <K extends keyof SVGElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): NodeListOf<SVGElementTagNameMap[K]>;
    <K extends keyof MathMLElementTagNameMap, T extends ParentNode>(selectors: K, context?: T): NodeListOf<MathMLElementTagNameMap[K]>;
    /** @deprecated*/<K extends keyof HTMLElementDeprecatedTagNameMap, T extends ParentNode = ParentNode>(selectors: K, context?: T): NodeListOf<Element>;
    <T extends ParentNode = ParentNode>(selectors: string, context?: T): NodeListOf<Element>;
  },
  byId = bind(selection, indefinite, 'getElementById') as <T extends Element>(elementId: string, context?: NonElementParentNode) => T | null;

export function siblings<T extends ParentNode>(context: T): Array<Element>;
export function siblings<T extends ParentNode, K extends keyof HTMLElementTagNameMap>(context: T, selector: K): Array<HTMLElementTagNameMap[K]>;
export function siblings<T extends ParentNode, K extends keyof SVGElementTagNameMap>(context: T, selector: K): Array<SVGElementTagNameMap[K]>;
export function siblings<T extends ParentNode>(context: T, selector: string): Array<Element>;
export function siblings<T extends ParentNode>(context: T, selector?: string): Array<Element> {
  if (!context || !parent(context))
    return [];

  return slice(children(parent(context)!))
    .filter(el => (el !== context as any) && (!selector || el.matches(selector)))
}

function attrSelector(name: 'querySelector' | 'querySelectorAll', attr: string, context?: ParentNode, value?: string) {
  return selection(name, concat("[", attr, value ? '="' + value + '"' : '', "]"), context);
}

function clsSelector(name: 'querySelector' | 'querySelectorAll', cls: string, context?: ParentNode) {
  return selection(name, "." + cls, context)
}

const qs = 'querySelector',
  qsa = 'querySelectorAll',
  attributeSelector = bind(attrSelector, indefinite, qs) as <E extends Element = Element>(name: string, context?: ParentNode, value?: Object) => E | null,
  attributeSelectorAll = bind(attrSelector, indefinite, qsa) as (name: string, context?: ParentNode, value?: Object) => NodeListOf<Element>,
  classSelector = bind(clsSelector, indefinite, qs) as <E extends Element = Element>(name: string, context?: ParentNode) => E | null,
  classSelectorAll = bind(clsSelector, indefinite, qsa) as (name: string, context?: ParentNode) => NodeListOf<Element>;

export {
  attributeSelector,
  attributeSelectorAll,
  classSelector,
  classSelectorAll
}
