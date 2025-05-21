import {PaginationActLabel} from "@/types/components/pagination";
import {requireDefined} from "@/core/objects/validators";
import {IllegalArgumentError} from "@/core/exceptions";
import {concat} from "@/core/shortcuts/indexable";
import {attribute, create, onEvent} from "@/components/shared";
import {apply} from "@/core/functions/apply";
import {nullable} from "@/core/utils/types";
import {PaginationOnElements} from "@/types/components/pagination/shared";
import {innerHTML} from "@/components/shared/elements/builders";
import {addClass} from "@/components/shared/styles/classname";

export function withPrefix(name: Object): string {
  return concat("pagination-", name);
}

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

  let onClick: any = nullable;

  if (label === "first")
    onClick = $this.toFirst;
  else if (label === "last")
    onClick = $this.toLast;
  else if (label === "previous")
    onClick = $this.previous;
  else if (label === "next")
    onClick = $this.next;

  onClick && onEvent(el, "click", () => apply(onClick, $this));

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
  onEvent(el, "click", () => $this.goto(page));
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
