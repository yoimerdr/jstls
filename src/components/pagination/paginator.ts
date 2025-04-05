import {ArrayLike} from "../../types/core/array";
import {readonly2, writeable} from "../../core/definer";
import {toInt} from "../../core/extensions/string";
import {requireIf} from "../../core/objects/validators";
import {coerceAtLeast, coerceIn} from "../../core/extensions/number";
import {slice} from "../../core/iterable";
import {WithPrototype} from "../../types/core/objects";
import {funclass} from "../../core/definer/classes";
import {ceil, min} from "../../core/shortcuts/math";
import {isDefined} from "../../core/objects/types";
import {uid} from "../../core/polyfills/symbol";
import {descriptor2} from "../../core/definer/shared";
import {set} from "../../core/objects/handlers/getset";
import {simple} from "../../core/definer/getters/builders";
import {nullable} from "../../core/utils/types";

/**
 * Paginating through collections of items
 */
export interface Paginator {
  /**
   * Total number of items
   * */
  readonly total: number;

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
  metaPages = uid('mP');

/**
 * Paginating through collections of items
 */
export const Paginator = funclass<PaginatorConstructor>({
  construct: function (total, perPage, page) {
    const $this = this;
    total = toInt(nullable, total)!;
    requireIf(total, isDefined, "The total must be a parseable number.");

    perPage = coerceAtLeast(1, toInt(nullable, perPage || 1) || 1)

    writeable($this, metaPerPage, perPage);
    writeable($this, metaPages, ceil(total / perPage!));
    writeable($this, metaCurrent, 1);

    readonly2($this, "total", total);

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
    current: descriptor2(simple(metaCurrent)),
    pages: descriptor2(simple(metaPages)),
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
      simple(metaPerPage),
      function (value: number) {
        const $this = this;
        value = $this.norm(value);
        set($this, metaPerPage, value);
        set($this, metaPages, ceil($this.total / value));
      })
  }
})
