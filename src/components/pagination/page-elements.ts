import {PaginationActLabel} from "@jstls/types/components/pagination";
import {call} from "@jstls/core/functions/call";
import {createActElement, createPageElement} from "./simple-elements";
import {onClick, preventDefault} from "@jstls/components/shared/events";
import {indefinite, nullable} from "@jstls/core/utils/types";
import {PagePaginationOnElements} from "@jstls/types/components/pagination/shared";
import {apply} from "@jstls/core/functions/apply";

/**
 * Creates a clickable action (next, first, previous, last) element for page pagination.
 * @param label The label type for the action
 * @returns The created HTML element with click handler
 */
export function actEl<T = any>(this: PagePaginationOnElements<T>, label: PaginationActLabel): HTMLElement {
  const $this = this,
    el = createActElement($this, "a", label),
    paginator = $this.paginator;

  let action: any = nullable, page;
  if (label === "first") {
    page = 1;
    action = $this.toFirst;
  } else if (label === "last") {
    page = paginator.pages;
    action = $this.toLast;
  } else if (label === "previous") {
    page = paginator.current - 1;
    action = $this.previous;
  } else if (label === "next") {
    page = paginator.current + 1;
    action = $this.next;
  }

  const url = page && page <= paginator.pages ? $this.url(page) : indefinite;
  action && onClick(el, (ev) => {
    if (!$this.cfg.reload) {
      apply(preventDefault, indefinite, [ev]);
      call(action, $this)
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

  onClick(el, (ev) => {
    if (!$this.cfg.reload) {
      apply(preventDefault, indefinite, [ev])
      $this.goto(page);
    }
  })
  return el;
}
