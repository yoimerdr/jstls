import {PaginationActLabel} from "@jstls/types/components/pagination";
import {requireDefined} from "@jstls/core/objects/validators";
import {IllegalArgumentError} from "@jstls/core/exceptions";
import {concat} from "@jstls/core/shortcuts/indexable";
import {attribute, create} from "@jstls/components/shared";
import {indefinite, nullable} from "@jstls/core/utils/types";
import {PaginationOnElements} from "@jstls/types/components/pagination/shared";
import {innerHTML} from "@jstls/components/shared/elements/builders";
import {addClass} from "@jstls/components/shared/styles/classname";
import {onClick} from "@jstls/components/shared/events";
import {bind} from "@jstls/core/functions/bind";
import {EmptyFunctionType} from "@jstls/types/core";

export const withPrefix = bind(concat, indefinite, "pagination-") as (prefix: Object, ...prefixes: Object[]) => string;

/**
 * Creates an action element for pagination
 * @param $this The pagination instance
 * @param tag The HTML tag to create
 * @param label The label type for the action
 * @returns The created HTML element
 */
export function createActElement<K extends keyof HTMLElementTagNameMap, T = any>($this: PaginationOnElements<T>, tag: K, label: PaginationActLabel): HTMLElementTagNameMap[K] {
  const el = create(tag),
    value = requireDefined($this.cfg.labels![label]);

  addClass(el, withPrefix("page"), withPrefix("action"), withPrefix(label))
  innerHTML(el, value.text)
  attribute(el, {
    "aria-current": "page",
    title: value.name!,
  });

  return el;
}

/**
 * Creates a clickable action (next, first, previous, last) element for pagination.
 * @param label The label type for the action
 * @returns The created HTML element with click handler
 */
export function actEl<T = any>(this: PaginationOnElements<T>, label: PaginationActLabel): HTMLElement {
  const $this = this,
    el = createActElement($this, 'button', label);

  let click: any = nullable;

  if (label === "first")
    click = $this.toFirst;
  else if (label === "last")
    click = $this.toLast;
  else if (label === "previous")
    click = $this.previous;
  else if (label === "next")
    click = $this.next;

  click && onClick(el, bind(click, $this));

  return el;
}

/**
 * Creates a clickable page element for pagination
 * @param $this The pagination instance
 * @param tag The HTML tag to create
 * @param page The page number or string to display
 * @throws {IllegalArgumentError} If page is falsy
 * @returns The created HTML element
 */
export function createPageElement<K extends keyof HTMLElementTagNameMap, T = any>($this: PaginationOnElements<T>, tag: K, page: string | number): HTMLElementTagNameMap[K] {
  if (!page)
    throw new IllegalArgumentError(concat("The page ", page, " is not allowed."));

  const el = create<K>(tag),
    paginator = $this.paginator,
    current = paginator.current;

  addClass(el, withPrefix("page"), withPrefix(page));
  page === current && addClass(el, withPrefix("current"), withPrefix("disabled"));
  innerHTML(el, page);

  attribute(el, {
    "aria-current": "page",
    "data-page": page,
    title: $this.cfg.name + " " + page,
  });

  return el;
}

/**
 * Creates a clickable element for change page in pagination.
 * @param page The page number or string to display
 * @returns The created HTML element with click handler
 */
export function pageEl<T = any>(this: PaginationOnElements<T>, page: number | string): HTMLElement {
  const $this = this,
    el = createPageElement($this, "button", page);
  onClick(el, bind($this.goto, $this, page, false) as EmptyFunctionType<any, any>);
  return el;
}

/**
 * Creates an ellipsis element
 * @param text The text to display in the ellipsis
 * @returns The created HTML element
 */
export function ellipsisEl<T = any>(this: PaginationOnElements<T>, text: string): HTMLElement {
  const el = create("button");
  addClass(el, withPrefix("page"), withPrefix("ellipsis"), withPrefix("disabled"))
  innerHTML(el, text);
  return el;
}
