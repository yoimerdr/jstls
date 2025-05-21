import {slice} from "@jstls/core/iterable";
import {apply} from "@jstls/core/functions/apply";

interface WithClasses {
  readonly classList: DOMTokenList
}

/**
 * Toggles a class on an element
 * @param el The target element
 * @param token The class name to toggle
 * @param force Optional boolean to force add/remove
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/toggle)
 */
export function toggleClass<T extends WithClasses>(el: T, token: string, force?: boolean) {
  return el.classList.toggle(token, force)
}

/**
 * Adds one or more classes to an element
 * @param el The target element
 * @param token The class names to add
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/add)
 */
export function addClass<T extends WithClasses>(el: T, ...token: string[]) {
  const list = el.classList;
  apply(list.add, list, slice(arguments, 1))
}

/**
 * Removes one or more classes to an element
 * @param el The target element
 * @param token The class names to remove
 * @see [MDN Reference](https://developer.mozilla.org/docs/Web/API/DOMTokenList/remove)
 */
export function removeClass<T extends WithClasses>(el: T, ...token: string[]) {
  const list = el.classList;
  apply(list.remove, list, slice(arguments, 1))
}


export function hasClass<T extends WithClasses>(el: T, ...token: string[]) {
  const list = el.classList;
  return slice(arguments, 1)
    .every(list.contains, list);
}
