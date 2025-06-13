import {property} from "@jstls/core/objects/handlers/builder";

export const parent = property<ParentNode, "parentNode">("parentNode"),
  children = property<ParentNode, 'children'>('children'),
  firstElement = property<Element, 'firstElementChild'>('firstElementChild'),
  lastElement = property<Element, 'lastElementChild'>('lastElementChild');
