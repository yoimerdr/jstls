import {PaginationActLabel} from "../../types/components/pagination";
import {call} from "../../core/functions/call";
import {createActElement, createPageElement} from "./simple-elements";
import {onEvent} from "../shared";
import {indefinite, nullable} from "../../core/utils/types";
import {PagePaginationOnElements} from "../../types/components/pagination/shared";

/**
 * Creates a clickable action (next, first, previous, last) element for page pagination.
 * @param label The label type for the action
 * @returns The created HTML element with click handler
 */
export function actEl<T = any>(this: PagePaginationOnElements<T>, label: PaginationActLabel): HTMLElement {
  const $this = this,
    el = createActElement($this, "a", label),
    paginator = $this.paginator;

  let onClick: any = nullable, page;
  if (label === "first") {
    page = 1;
    onClick = $this.toFirst;
  } else if (label === "last") {
    page = paginator.pages;
    onClick = $this.toLast;
  } else if (label === "previous") {
    page = paginator.current - 1;
    onClick = $this.previous;
  } else if (label === "next") {
    page = paginator.current + 1;
    onClick = $this.next;
  }

  const url = page ? $this.url(page) : indefinite;
  onClick && onEvent(el, "click", (ev) => {
    if (!$this.cfg.reload) {
      ev.preventDefault();
      call(onClick, $this)
    }
  })

  url && (el.href = url);

  return el;
}

/**
 * Creates a clickable element for change page in page pagination.
 * @param page The page number or string to display
 * @returns The created HTML element with click handler
 */
export function pageEl<T = any>(this: PagePaginationOnElements<T>, page: number | string): HTMLElement {
  const $this = this,
    el = createPageElement($this, "a", page);

  el.href = $this.url(page);

  onEvent(el, "click", (ev) => {
    if (!$this.cfg.reload) {
      ev.preventDefault();
      $this.goto(page);
    }
  })
  return el;
}
