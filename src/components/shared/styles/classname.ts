import {includes} from "@/core/polyfills/indexable/es2016";

import {join, reduce, slice} from "@/core/iterable";
import {apply} from "@/core/functions/apply";
import {WithClassName} from "@/types/core";
import {remove} from "@/core/extensions/array/fn";
import {indefinite} from "@/core/utils/types";
import {concat} from "@/core/shortcuts/indexable";
import {isDefined} from "@/core/objects/types";
import {set2} from "@/core/objects/handlers/getset";
import {KeyableObject} from "@/types/core/objects";
import {keys} from "@/core/shortcuts/object";

export function getClasses<T extends WithClassName>(el: T): string[] {
  const name = el && el.className || "";

  return name.split(/\s+/g);
}

export function setClasses<T extends WithClassName>(el: T, classes: string[]) {
  const map = reduce(classes, (map, it) => {
    set2(map, it, indefinite)
    return map;
  }, {} as KeyableObject);

  el.className = join(keys(map), " ")
}

/**
 * Adds one or more classes to an element
 * @param el The target element
 * @param token The class names to add
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/add)
 */
export function addClass<T extends WithClassName>(el: T, ...token: string[]) {
  const list = getClasses(el);
  apply(list.push, list, slice(arguments, 1))
  setClasses(el, list);
}

export function hasClass<T extends WithClassName>(el: T, ...token: string[]) {
  const list = getClasses(el);
  return slice(arguments, 1)
    .every(el => apply(includes, list, [el]));
}

/**
 * Removes one or more classes to an element
 * @param el The target element
 * @param token The class names to remove
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/remove)
 */
export function removeClass<T extends WithClassName>(el: T, ...token: string[]) {
  const list = getClasses(el);
  apply(remove, indefinite, concat([list], slice(arguments, 1)))
  el.className = join(list, " ")
}

/**
 * Toggles a class on an element
 * @param el The target element
 * @param token The class name to toggle
 * @param force Optional boolean to force add/remove
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/toggle)
 */
export function toggleClass<T extends WithClassName>(el: T, token: string, force?: boolean) {
  const list = getClasses(el),
    notHas = list.indexOf(token) === -1
  if(!isDefined(force))
    force = notHas
  force ? (notHas && list.push(token)) : remove(list, token)

  el.className = join(list, " ")
}
