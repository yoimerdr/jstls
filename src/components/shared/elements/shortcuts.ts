import {property} from "@jstls/core/objects/handlers/builder";

export const parent = property<ParentNode, "parentNode">("parentNode"),
  children = property<ParentNode, 'children'>('children'),
  nodes = property<ParentNode, 'childNodes'>('childNodes'),
  parentElement = property<Element, 'parentElement'>('parentElement'),
  firstElement = property<Element, 'firstElementChild'>('firstElementChild'),
  lastElement = property<Element, 'lastElementChild'>('lastElementChild'),
  style = property<ElementCSSInlineStyle, "style">("style");
