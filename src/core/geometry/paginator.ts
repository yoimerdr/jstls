import {writeable} from "@jstls/core/definer";
import {toInt} from "@jstls/core/extensions/string";
import {requireIf} from "@jstls/core/objects/validators";
import {coerceAtLeast, coerceIn} from "@jstls/core/extensions/number/";
import {slice} from "@jstls/core/iterable";
import {funclass2} from "@jstls/core/definer/classes/funclass";
import {ceil, min} from "@jstls/core/shortcuts/math";
import {isDefined, isNumber} from "@jstls/core/objects/types";
import {uid} from "@jstls/core/polyfills/symbol";
import {descriptor2} from "@jstls/core/definer/shared";
import {set} from "@jstls/core/objects/handlers/getset";
import {simple} from "@jstls/core/definer/getters/builders";
import {indefinite, nullable} from "@jstls/core/utils/types";
import {WithPrototype} from "@jstls/types/core/objects";
import {ArrayLike} from "@jstls/types/core/array";
import {len} from "@jstls/core/shortcuts/indexable";
import {partial} from "@jstls/core/functions/partial";
/**
 * Paginating through collections of items
 */
interface Paginator {
  /**
   * Total number of items
   * */
  total: number;

  /**
   * Number of items per page
   * */
  perPage: number;

  /**
   * Current page number
   * */
  readonly current: number;

  /**
   * Total number of pages
   * */
  readonly pages: number;

  /**
   * Whether there is a next page available
   * */
  readonly hasNext: boolean;

  /**
   *  Whether there is a previous page available
   *  */
  readonly hasPrevious: boolean;

  /**
   * Starting index of current page
   * */
  readonly start: number;

  /**
   * Ending index of current page
   * */
  readonly end: number;

  /**
   * Move to next page if available
   * */
  next(): boolean;

  /**
   * Move to previous page if available
   * */
  previous(): boolean;

  /**
   * Move to specific page
   * @param page Page number or string that can be parsed as page number
   * @returns Whether the page changed
   */
  goto(page: number | string): boolean;

  /**
   * Get items for current page from source array
   * @param source Array-like source of items
   * @returns Array of items for current page
   */
  items<T>(source: ArrayLike<T>): T[];

  /**
   * Normalize a page number to be within valid range
   * @param value Page number or string to normalize
   * @returns Normalized page number
   */
  norm(value: string | number): number;
}

export interface PaginatorConstructor extends WithPrototype<Paginator> {
  new(total: number, perPage?: number, page?: number): Paginator;
}

const metaCurrent = uid('mC'),
  metaPerPage = uid('mP'),
  metaPages = uid('mP'),
  metaTotal = uid('mT'),

/**
 * Paginating through collections of items
 */
Paginator: PaginatorConstructor = funclass2({
  construct: function (total, perPage, page) {
    const $this = this;
    writeable($this, metaTotal, indefinite);
    $this.total = total;
    perPage = coerceAtLeast(1, toInt(nullable, perPage || 1) || 1)

    writeable($this, metaPerPage, perPage);
    writeable($this, metaPages, ceil(total / perPage!));
    writeable($this, metaCurrent, 1);

    page && $this.goto(page);
  },
  prototype: {
    next() {
      const $this = this;
      return $this.goto($this.current + 1);
    },
    previous() {
      const $this = this;
      return $this.goto($this.current - 1);
    },
    items(source) {
      const $this = this;
      return slice(source, $this.start, $this.end);
    },
    norm(page) {
      return coerceIn(1, this.pages, toInt(nullable, page || 1,) || 1,);
    },
    goto(page) {
      const $this = this, current = $this.current;
      page = $this.norm(page);
      if (current === page)
        return false;
      set($this, metaCurrent, page)
      return true
    }
  },
  protodescriptor: {
    current: descriptor2(partial(simple<Paginator>, metaCurrent)),
    pages: descriptor2(partial(simple<Paginator>, metaPages)),
    total: descriptor2(partial(simple<Paginator>, metaTotal), function (total: number) {
      total = toInt(nullable, total)!
      requireIf(total, isDefined, "The total must be a parseable number.");
      const $this = this;
      set($this, metaTotal, total);
      set($this, metaPages, ceil(total / $this.perPage));
      set($this, metaCurrent, $this.norm($this.current));
    }),
    hasNext: descriptor2<Paginator>(function () {
      const $this = this;
      return $this.current < $this.total;
    }),
    hasPrevious: descriptor2<Paginator>(function () {
      return this.current > 1;
    }),
    start: descriptor2<Paginator>(function () {
      const $this = this;
      return ($this.current - 1) * $this.perPage;
    }),
    end: descriptor2<Paginator>(function () {
      const $this = this, {start, total} = $this;
      return start === 0 && total === 0 ? 0 : min(start + $this.perPage, total - 1);
    }),
    perPage: descriptor2<Paginator>(
      partial(simple<Paginator>, metaPerPage),
      function (value: number) {
        const $this = this;
        value = $this.norm(value);
        set($this, metaPerPage, value);
        set($this, metaPages, ceil($this.total / value));
      })
  }
})

/**
 * Creates a paginator based on the given arguments.
 * @param total Total number of items or array-like object to paginate
 * @param perPage Number of items per page
 * @param page Current page number
 */
export function paginator(total: number | ArrayLike, perPage?: number, page?: number): Paginator {
  total = isNumber(total) ? total as number : len(total as ArrayLike);
  return new Paginator(total, perPage, page);
}

export {
  Paginator,
}
